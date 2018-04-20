'use strict';

/**
 * Common gmaps helper functions.
 */
class GMapHelper { // eslint-disable-line

	/**
	 * GMaps load function with config.
	 */
	static load( config = {} ) {

		if( typeof document === 'undefined'
			|| document.getElementById( 'google-maps-script' )
		)
			return; // Do nothing if run from server-side or if script already founded

		const default_config = {
			key: 'AIzaSyBG8LXp4osGIgtI1SxUafmy6fPsgMq414c',
			libraries: null,
			callback: null,
		};

		const options = Object.assign(
			{},
			default_config,
			config
		);

		let url = `https://maps.googleapis.com/maps/api/js?${
			Object
				.keys( options )
				.filter( key => !! options[ key ] )
				.map( key => encodeURIComponent( key ) + '=' + encodeURIComponent( options[ key ] ) )
				.join( '&' )
		}`;

		const GMapScript = document.createElement( 'script' );

		GMapScript.id = 'google-maps-script';
		GMapScript.src = url;
		GMapScript.async = true;
		GMapScript.defer = true;

		document.body.appendChild( GMapScript );

	};

	// Do this on every Maps Loaded event. --> Only to obtain more on Lighthouse's accessibility.
	static mapsLoaded( map ) {

		const iframe = map.querySelector( 'iframe' );
		if( iframe )
			iframe.title = 'Google maps';

		function step() {

			const anchors = map.querySelectorAll( 'a' );

			if( ! anchors.length )
				window.requestAnimationFrame( step );
			else {

				// Map is now fully-visible
				map.setAttribute( 'aria-hidden', false );

				// Accessibility
				anchors.forEach( anchor => anchor.rel = 'noopener' );

			};

		};
		window.requestAnimationFrame( step );

	};

};
