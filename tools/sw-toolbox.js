// Custom background-sync
const reviewsQueueName = 'reviewsQueue';
workbox.routing.registerRoute(
	new RegExp( /.*\/reviews\/\?restaurant_id=[1,9]$/ ),
	workbox.strategies.networkOnly(
		{
			plugins: [
				new workbox.backgroundSync.Plugin(
					reviewsQueueName,
					{
						maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
					}
				),
			],
		}
	),
	'POST'
);

// Sync
/*
self.addEventListener(
	'sync',
	event => {

		if( event.tag === reviewsQueueName ) {

			window.console.log( event );
			// event.waitUntil();

		};

	}
);
*/
