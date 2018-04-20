(
	function( window ) {

		'use strict';

		if( 'serviceWorker' in window.navigator
			&& (
				window.location.protocol === 'https:'
				|| window.location.href.indexOf( 'localhost:[SERVICE-WORKER-EXCLUDED-PORT]' ) === - 1
			)
		) {

			function serviceWorker() {

				function SWRegistration( registration ) {

					if( typeof registration.update === 'function' )
						registration.update();

					registration.onupdatefound = () => {

						const installingWorker = registration.installing;

						installingWorker.onstatechange = () => {

							switch( installingWorker.state ) {
								case 'installed':

									if( window.navigator.serviceWorker.controller )
										window.console.info( 'New or updated content is available.' );
									else
										window.console.info( 'Content is cached, and will be available for offline use the next time the page is loaded.' );

								break;
								case 'redundant':

									window.console.error( 'The installing service worker became redundant.' );

								break;
							};

						};

					};

				};

				// Start Service Worker
				window.navigator
					.serviceWorker
					.register(
						'[SERVICE-WORKER-NAME]',
						{
							scope: './'
						}
					)
					.then( SWRegistration )
					.catch( e => window.console.error( 'Error during service worker registration:', e ) )
				;

				// Remove listener
				window.removeEventListener( 'load', serviceWorker );

			};
			// Register after load, for fast startup
			window.addEventListener( 'load', serviceWorker, false );

		};

	}
)( window )
