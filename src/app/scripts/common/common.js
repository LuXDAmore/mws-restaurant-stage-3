// Custom forEach should be more performant.
// FROM => https://stackoverflow.com/a/41462717/3446499
function customForEach( fn ) {

	const arr = this
		, len = arr.length
	;
    for( let i = 0; i < len; ++ i )
        fn( arr[ i ], i );

};
Object.defineProperty( Array.prototype, 'customForEach', { enumerable: false, value: customForEach } );

// Common
(
	function( window, document ) {

		'use strict';

		// Online ed Offline tasks
		function OnlineOffline() {

			// Show cached version of GMaps.
			if( ! window.navigator.onLine ) {

				document.body.classList.add( 'offline' );

				const map = document.getElementById( 'map' );
				if( map )
					map.setAttribute( 'aria-hidden', false );

			};

			// Add class for offline
			function handleNetworkChange( event ) {

				document.body.classList.toggle( 'offline' );

			};
			window.addEventListener( 'online', handleNetworkChange, false );
			window.addEventListener( 'offline', handleNetworkChange, false );

		};
		document.addEventListener( 'DOMContentLoaded', OnlineOffline, false );

		// Ready
		window.console.log( '%c RESTAURANT REVIEWS, ready to rock ✌️', 'color:#2980b9' );

	}
)( window, document )
