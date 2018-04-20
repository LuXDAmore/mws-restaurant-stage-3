'use strict';

const IS_LOCALHOST_OR_DEV = !! ( ~ window.location.href.indexOf( 'localhost' ) || ~ window.location.href.indexOf( 'dev.' ) );
const URL = IS_LOCALHOST_OR_DEV ? 'http://localhost:1337/restaurants/' : 'data/restaurants.json';
const DB_NAME = 'restaurant_reviews';
let restaurants = null;

// DB Offline
const DB = new Dexie( DB_NAME );
DB
	.version( 1 )
	.stores(
		{
			restaurants: '&id,cuisine_type,neighborhood',
		}
	)
;

/**
 * Common database helper functions.
 */
class DBHelper { // eslint-disable-line

	/**
	 * Fetch all restaurants.
	 */
	static fetchRestaurants(
		callback,
		id = ''
	) {

		// Check if already in-js
		if( restaurants ) {

			callback( null, restaurants );
			return;

		};

		// Responses
		function getData( response ) {

			// Oops!. Got an error from server.
			if( ! response.ok ) {

				window.console.error( response );

				const error = 'Error during Network request';
				throw new Error( error );

			};

			// Got a success response from server!
			return response.json();

		};
		function returnData( response = [] ) {

			restaurants = response;

			if( restaurants && restaurants.length )
				DB.restaurants.bulkAdd( restaurants ).catch( () => DB.restaurants.bulkPut( restaurants ) );

			callback( null, restaurants );

			return response;

		};
		function returnError( error ) {

			window.console.error( error );

			callback( error, restaurants );

			return error;

		};

		// Fetch
		function fetchData() {

			// Options
			const options = {
				headers: {
					'Content-Type': 'application/json',
				},
				referrerPolicy: 'no-referrer',
			};
			const req = new Request( ( IS_LOCALHOST_OR_DEV ? `${ URL }${ id }` : URL ), options );

			fetch( req )
				.then( getData )
				.then( returnData )
				.catch( returnError )
			;

		};

		if( ! id ) {

			DB.restaurants.toArray().then(
				restaurants => {

					if( restaurants && restaurants.length )
						callback( null, restaurants );
					else
						fetchData();

					return restaurants;

				}
			).catch( fetchData );

		} else {

			DB.restaurants.get( parseInt( id ) ).then(
				restaurant => {

					if( restaurant )
						callback( null, restaurant );
					else
						fetchData();

					return restaurants;

				}
			).catch( fetchData );

		};

	};

	/**
	 * Fetch a restaurant by its ID.
	 */
	static fetchRestaurantById( callback, id = '' ) {

		// fetch all restaurants with proper error handling.
		DBHelper.fetchRestaurants(
			( error, restaurants ) => {

				if( error )
					callback( error, null );
				else {

					const searchRestaurants = Array.isArray( restaurants ) ? restaurants : [ restaurants ];
					const position = searchRestaurants.map( obj => obj.id ).indexOf( parseInt( id ) );

					// Got the restaurant
					if( ~ position )
						callback( null, searchRestaurants[ position ] );
					// Restaurant does not exist in the database
					else
						callback( 'Restaurant does not exist', null );

				}

			},
			id
		);

	};

	/**
	 * Fetch restaurants by a cuisine type with proper error handling.
	 */
	static fetchRestaurantByCuisine( cuisine, callback ) {

		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants(
			( error, restaurants ) => {

				if( error )
					callback( error, null );
				else {

					// Filter restaurants to have only given cuisine type
					const results = restaurants.filter( r => r.cuisine_type === cuisine );
					callback( null, results );

				};

			}
		);

	};

	/**
	 * Fetch restaurants by a neighborhood with proper error handling.
	 */
	static fetchRestaurantByNeighborhood( neighborhood, callback ) {

		// Fetch all restaurants
		DBHelper.fetchRestaurants(
			( error, restaurants ) => {

				if( error )
					callback( error, null );
				else {

					// Filter restaurants to have only given neighborhood
					const results = restaurants.filter( r => r.neighborhood === neighborhood );
					callback( null, results );

				};

			}
		);

	};

	/**
	 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
	 */
	static fetchRestaurantByCuisineAndNeighborhood( cuisine, neighborhood, callback ) {

		// Fetch all restaurants
		DBHelper.fetchRestaurants(
			( error, restaurants ) => {

				if( error )
					callback( error, null );
				else {

					let results = restaurants;

					// filter by cuisine
					if( cuisine !== 'all' )
						results = results.filter( r => r.cuisine_type === cuisine );

					// filter by neighborhood
					if( neighborhood !== 'all' )
						results = results.filter( r => r.neighborhood === neighborhood );

					callback( null, results );

				};

			}
		);

	};

	/**
	 * Fetch all neighborhoods with proper error handling.
	 */
	static fetchNeighborhoods( callback ) {

		// Fetch all restaurants
		DBHelper.fetchRestaurants(
			( error, restaurants ) => {

				if( error )
					callback( error, null );
				else {

					// Get all neighborhoods from all restaurants
					const neighborhoods = restaurants.map( ( v, i ) => restaurants[ i ].neighborhood );

					// Remove duplicates from neighborhoods
					const uniqueNeighborhoods = neighborhoods.filter( ( v, i ) => neighborhoods.indexOf( v ) === i );

					callback( null, uniqueNeighborhoods );

				}

			}
		);

	};

	/**
	 * Fetch all cuisines with proper error handling.
	 */
	static fetchCuisines( callback ) {

		// Fetch all restaurants
		DBHelper.fetchRestaurants(
			( error, restaurants ) => {

				if( error )
					callback( error, null );
				else {

					// Get all cuisines from all restaurants
					const cuisines = restaurants.map( ( v, i ) => restaurants[ i ].cuisine_type );

					// Remove duplicates from cuisines
					const uniqueCuisines = cuisines.filter( ( v, i ) => cuisines.indexOf( v ) === i );

					callback( null, uniqueCuisines );

				}

			}
		);

	};

	/**
	 * Restaurant page URL.
	 */
	static urlForRestaurant( restaurant ) {

		return `restaurant.html?id=${ restaurant.id }`;

	};

	/**
	 * Restaurant images alt text.
	 */
	static altTextForRestaurantImages( restaurant ) {

		return `${ restaurant.name }, ${ restaurant.cuisine_type }`;

	};

	/**
	 * Create srcSet of images in Picture.
	 */
	static generateSourceInPicture(
		restaurant,
		picture,
		medias = [
			800,
			640,
			480,
			400
		],
		types = [
			'webp',
			'jpg',
		],
		retina = false,
		alt = DBHelper.altTextForRestaurantImages( restaurant ),
		custom_class = 'restaurant-img',
		fallback_img = 400
	) {

		if( medias.length
			&& types.length
		) {

			for( let i = 0; i < medias.length; i ++ ) {

				const media = medias[ i ];

				for( let j = 0; j < types.length; j ++ ) {

					const source = document.createElement( 'source' )
						, type = types[ j ]
					;

					let srcset = DBHelper.imageUrlForRestaurant( restaurant, media, type );
					if( retina )
						srcset += ` 1x, ${ DBHelper.imageUrlForRestaurant( restaurant, media * 2, type ) } 2x`;

					source.dataset.srcset = srcset;
					source.media = `(min-width: ${ media }px)`;
					source.type = `image/${ type }`;

					picture.append( source );

				};

			};

		};

		// Fallback
		const image = document.createElement( 'img' );

		image.dataset.src = DBHelper.imageUrlForRestaurant( restaurant, fallback_img, 'jpg' );
		image.className = custom_class;
		image.alt = alt;

		picture.append( image );

	};

	/**
	 * Start the Lazy Loading of images
	 */
	static lazyLoadImages() {

		if( typeof LazyLoad !== 'undefined' ) {

			new LazyLoad(
				{
					elements_selector: '.restaurant-img',
				}
			);

		};

	};

	/**
	 * Restaurant image URL.
	 */
	static imageUrlForRestaurant(
		restaurant,
		size = 400,
		extension = ''
	) {

		return `assets/images/${ size }/${ restaurant.photograph }.${ extension }`;

	};

	/**
	 * Map marker for a restaurant.
	 */
	static mapMarkerForRestaurant( restaurant, map ) {

		const icon = {
			url: 'assets/images/placeholder/map-marker.webp',
			size: new google.maps.Size( 43, 68 ),
			scaledSize: new google.maps.Size( 27, 43 ),
		};

		const marker = new google.maps.Marker(
			{
				position: restaurant.latlng,
				title: DBHelper.altTextForRestaurantImages( restaurant ),
				url: DBHelper.urlForRestaurant( restaurant ),
				map: map,
				icon,
			}
		);

		return marker;

	};

}
