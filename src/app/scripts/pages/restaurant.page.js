(
	function( window, document ) {

		'use strict';

		// Check the right page
		const IS_RESTAURANT = !! ~ window.location.href.indexOf( 'restaurant.html' );
		if( ! IS_RESTAURANT )
			return;

		// Common vars
		let restaurant
			, map
		;

		// Self
		const self = {
			restaurant,
			map,
		};

		/**
		 * Initialize Google map.
		 */
		window.initMapRestaurantInfo = () => {

			fetchRestaurantFromURL(
				( error, restaurant ) => {

					// Got an error!
					if( error ) {

						window.console.error( error );
						return error;

					};

					const map = document.getElementById( 'map' );

					self.map = new google.maps.Map(
						map,
						{
							zoom: 16,
							center: restaurant.latlng,
							scrollwheel: false,
							disableDefaultUI: true,
						}
					);

					google.maps.event.addListenerOnce(
						self.map,
						'tilesloaded',
						() => GMapHelper.mapsLoaded( map )
					);

					fillBreadcrumb();

					DBHelper.lazyLoadImages();
					DBHelper.mapMarkerForRestaurant( self.restaurant, self.map );

				}
			);

		};

		// Async - Defer GMaps
		GMapHelper.load(
			{
				callback: 'initMapRestaurantInfo',
			}
		);

		/**
		 * Get current restaurant from page URL.
		 */
		function fetchRestaurantFromURL( callback ) {

			// restaurant already fetched!
			if( self.restaurant ) {

				callback( null, self.restaurant );
				return;

			};

			const id = getParameterByName( 'id' );

			// no id found in URL
			if( ! id )
				callback( 'No restaurant id in URL', null );
			else {

				DBHelper.fetchRestaurantById(
					( error, restaurant ) => {

						self.restaurant = restaurant;

						if( ! restaurant ) {

							window.console.error( error );
							return;

						};

						fillRestaurantHTML();

						callback( null, restaurant );

					},
					id
				);

			};

		};

		/**
		 * Create restaurant HTML and add it to the webpage
		 */
		function fillRestaurantHTML( restaurant = self.restaurant ) {

			const restaurant_container = document.getElementById( 'restaurant-container' )
				, name = document.getElementById( 'restaurant-name' )
				, address = document.getElementById( 'restaurant-address' )
				, picture = document.getElementById( 'restaurant-img' )
				, cuisine = document.getElementById( 'restaurant-cuisine' )
			;

			// Title
			name.textContent = restaurant.name;

			// Address
			address.textContent = restaurant.address;

			// Image
			DBHelper.generateSourceInPicture( restaurant, picture );

			// Cuisine
			cuisine.textContent = restaurant.cuisine_type;

			// fill operating hours
			if( restaurant.operating_hours )
				fillRestaurantHoursHTML();

			// fill reviews
			if( restaurant.review )
				fillReviewsHTML( null );
			else
				DBHelper.fetchReviewsByRestaurantId( fillReviewsHTML, restaurant.id );

			restaurant_container.setAttribute( 'aria-busy', false );

		};

		/**
		* Create restaurant operating hours HTML table and add it to the webpage.
		*/
		function fillRestaurantHoursHTML( operatingHours = self.restaurant.operating_hours ) {

			const hours = document.getElementById( 'restaurant-hours' )
				, rows = []
			;

			for( const key in operatingHours ) {

				const row = document.createElement( 'tr' )
					, day = document.createElement( 'td' )
					, time = document.createElement( 'td' )
				;

				// Day && time
				day.textContent = key;
				time.innerHTML = operatingHours[ key ].replace( ', ', '<br />' );

				// Appending of generated elements
				row.append( day, time );

				// NodeList of elements
				rows.push( row );

			};

			hours.append( ...rows );

		};

		/**
		* Create all reviews HTML and add them to the webpage.
		*/
		function fillReviewsHTML( error, reviews = self.restaurant.reviews ) {

			const ul = document.getElementById( 'reviews-list' );

			// Reset ul
			ul.textContent = '';

			if( error || ! reviews || ! reviews.length ) {

				const li = document.createElement( 'li' )
					, title = document.createElement( 'p' )
					, subtitle = document.createElement( 'em' )
				;

				subtitle.textContent = error ? 'There was an error while fetching reviews!' : 'No reviews yet!';

				// Append generated elements
				title.appendChild( subtitle );
				li.appendChild( title );

				ul.appendChild( li );
				ul.setAttribute( 'aria-busy', false );

				if( error )
					window.console.error( error );

				return;

			};

			// Reviews
			const li = [];
			reviews.customForEach( review => li.push( createReviewHTML( review ) ) );

			ul.append( ...li );
			ul.setAttribute( 'aria-busy', false );

		};

		/**
		* Create review HTML and add it to the webpage.
		*/
		function createReviewHTML( review ) {

			const li = document.createElement( 'li' )
				, title = document.createElement( 'p' )
				, name = document.createElement( 'strong' )
				, subtitle = document.createElement( 'p' )
				, date = document.createElement( 'em' )
				, rating = document.createElement( 'span' )
				, comments = document.createElement( 'p' )
			;

			// Title
			name.textContent = review.name;

			// Date
			date.textContent = review.date;

			// Rating
			rating.textContent = `Rating: ${ review.rating }`;

			// Comments
			comments.textContent = review.comments;

			// Append generated elements
			title.appendChild( name );
			subtitle.append( date, rating );

			// Append generated elements
			li.append( title, subtitle, comments );

			return li;

		};

		/**
		* Add restaurant name to the breadcrumb navigation menu
		*/
		function fillBreadcrumb( restaurant = self.restaurant ) {

			const breadcrumb = document.getElementById( 'breadcrumb' )
				, li = document.createElement( 'li' )
			;

			li.textContent = restaurant.name;
			li.setAttribute( 'aria-current', 'page' );

			breadcrumb.appendChild( li );

		};

		/**
		* Get a parameter by name from page URL.
		*/
		function getParameterByName( name, url ) {

			if( ! url )
				url = window.location.href;

			name = name.replace( /[\[\]]/g, '\\$&' );

			const regex = new RegExp( `[?&]${ name }(=([^&#]*)|&|#|$)` )
				, results = regex.exec( url )
			;

			if( ! results )
				return null;

			if( ! results[ 2 ] )
				return '';

			return decodeURIComponent( results[ 2 ].replace( /\+/g, ' ' ) );

		};

		/**
		* Show / Hide form for adding a review
		*/
		const buttonToggleForm = document.querySelector( '[data-action="toggle-form"]' )
			, buttonSubmitForm = document.querySelector( '[type="submit"]' )
		;
		function resetForm( form ) {

			const name = form.querySelector( '[name="name"]' )
				, comments = form.querySelector( '[name="comments"]' )
				, rating = form.querySelector( 'input[type="radio"][value="5"]' )
			;

			name.value = '';
			comments.value = '';
			rating.checked = true;

			name.classList.remove( 'error' );
			comments.classList.remove( 'error' );
			rating.classList.remove( 'error' );

			name.disabled = false;
			comments.disabled = false;
			rating.disabled = false;
			buttonSubmitForm.disabled = false;

		};
		function toggleFormAddReview( e ) {

			e.preventDefault();

			const oldValue = this.getAttribute( 'aria-expanded' )
				, newValue = oldValue === 'false' ? true : false
				, controlledForm = this.getAttribute( 'aria-controls' )
			;

			this.setAttribute( 'aria-expanded', newValue );

			const form = document.getElementById( controlledForm );
			form.setAttribute( 'aria-hidden', oldValue );

			if( newValue === true ) {

				resetForm( form );
				form.querySelector( 'input[type="text"]' ).focus();

			};

		};
		buttonToggleForm.addEventListener( 'click', toggleFormAddReview, false );

		/**
		* Check data before submit
		*/

		function sendReview( e ) {

			e.preventDefault();

			const form = this.closest( 'form' )
				, name = form.querySelector( '[name="name"]' )
				, comments = form.querySelector( '[name="comments"]' )
				, rating = form.querySelector( '[name="rating"][checked]' )
			;

			name.classList.remove( 'error' );
			comments.classList.remove( 'error' );
			rating.classList.remove( 'error' );

			if( ! name.value )
				name.classList.add( 'error' );

			if( ! comments.value )
			comments.classList.add( 'error' );

			if( ! rating.value )
				rating.classList.add( 'error' );

			if( name.value
				&& comments.value
				&& rating.value
			) {

				this.disabled = true;
				name.disabled = true;
				comments.disabled = true;
				rating.disabled = true;

				buttonToggleForm.click();

			} else
				window.alert( 'You must fill the form fields!' );

		};
		buttonSubmitForm.addEventListener( 'click', sendReview, false );

	}
)( window, document )
