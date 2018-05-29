'use strict';

const IS_LOCALHOST_OR_DEV = !! ( ~ window.location.href.indexOf( 'localhost' ) || ~ window.location.href.indexOf( 'dev.' ) );
const URL = IS_LOCALHOST_OR_DEV ? 'http://localhost:1337/restaurants/' : 'data/restaurants.json';
const URL_REVIEWS = 'http://localhost:1337/reviews/';
const DB_NAME = 'restaurants';
const DB_REVIEWS_NAME = 'reviews';
let restaurants = null
	, reviews = null
;

// DB Offline
const DB = new Dexie( DB_NAME )
	, DB_REVIEWS = new Dexie( DB_REVIEWS_NAME )
;
DB
	.version( 1 )
	.stores(
		{
			restaurants: '&id,cuisine_type,neighborhood',
			reviews: '&id,restaurant_id',
		}
	)
;
DB_REVIEWS
	.version( 1 )
	.stores(
		{
			reviews: '++',
			restaurants: '&restaurant_id,id',
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

			return;

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

		if( ! restaurant.photograph )
			return `https://via.placeholder.com/${ size }.${ extension }/fff/333?text=no+image+available`;

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
				map,
				icon,
			}
		);

		return marker;

	};

	/**
	 * Fetch all reviews by restaurant id.
	 */
	static fetchReviewsByRestaurantId(
		callback,
		restaurant_id,
		review_id
	) {

		// Check if already in-js
		if( reviews ) {

			callback( null, reviews );
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

			reviews = response;

			if( reviews && reviews.length )
				DB_REVIEWS.reviews.bulkAdd( reviews ).catch( () => DB_REVIEWS.reviews.bulkPut( reviews ) );

			callback( null, reviews );

			return response;

		};
		function returnError( error ) {

			window.console.error( error );

			callback( error, reviews );

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
			const req = new Request( `${ URL_REVIEWS }?restaurant_id=${ restaurant_id }`, options );

			fetch( req )
				.then( getData )
				.then( returnData )
				.catch( returnError )
			;

			return;

		};

		if( ! review_id ) {

			DB_REVIEWS.reviews.toArray().then(
				reviews => {

					if( reviews && reviews.length )
						callback( null, reviews );
					else
						fetchData();

					return reviews;

				}
			).catch( fetchData );

		} else {

			DB_REVIEWS.reviews.get( parseInt( review_id ) ).then(
				review => {

					if( review )
						callback( null, review );
					else
						fetchData();

					return reviews;

				}
			).catch( fetchData );

		};

	};

	/**
	 * Add a review.
	 */
	static addReviewToRestaurant( review ) {

		window.console.log( review );

		const body = new FormData();
		Object
			.keys( review )
			.filter( key => !! review[ key ] )
			.map( key => body.append( key, encodeURIComponent( review[ key ] ) ) )
		;

		// Options
		const options = {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
			},
			referrerPolicy: 'no-referrer',
			body,
		};
		const req = new Request( URL_REVIEWS, options );

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
		function returnError( error ) {

			window.console.error( error );

			notie.alert(
				{
					type: 'error',
					text: 'Error saving the review, the request was enqueued for a day.',
					position: 'bottom',
				}
			);

			return error;

		};

		DB_REVIEWS.reviews
			.add( review ) // .then( () => 'serviceWorker' in window.navigator && window.navigator.serviceWorker.ready.then( reg => reg.sync.register( 'reviewsQueue' ) ) )
			.catch(
				error => {

					window.console.error( error );

					notie.alert(
						{
							type: 'error',
							text: "Can't queue review. IDB error",
							position: 'bottom',
						}
					);

				}
			)
		;

		// Fetch
		return fetch( req )
			.then( getData )
			.catch( returnError )
		;

	};

}
