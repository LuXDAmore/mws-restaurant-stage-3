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

							let type = 'info'
								, text = ''
							;

							switch( installingWorker.state ) {
								case 'installed':

									if( window.navigator.serviceWorker.controller ) {

										type = 'warning';
										text = 'New or updated content is available. Please refresh the page.';

									} else
										text = 'Content is cached, and will be available for offline use the next time the page is loaded.';

								break;
								case 'redundant':

									type = 'error';
									text = 'The installing service worker became redundant.';

								break;
							};

							if( ! text )
								return;

							window.console[ type ]( text );

							notie.alert(
								{
									type,
									text,
									position: 'bottom',
								}
							);

						};

					};

				};

				// Start Service Worker
				window.navigator
					.serviceWorker
					.register(
						'[SERVICE-WORKER-NAME]',
						{
							scope: './',
						}
					)
					.then( SWRegistration )
					.catch( e => window.console.error( 'Error during service worker registration:', e ) )
				;

				// Remove listener
				window.removeEventListener( 'load', serviceWorker );

			};
			// Register after load, for fast startup
			window.addEventListener( 'load', serviceWorker );

		};

	}
)( window )
