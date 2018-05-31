const reviewsQueueName = 'reviewsQueue';

// Background-sync: Queue request
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

// // Data
// const queue = new workbox.backgroundSync.Queue( reviewsQueueName );
// self.addEventListener(
// 	'fetch',
// 	event => {

// 		// Clone the request to ensure it's save to read when adding to the Queue.
// 		const promiseChain = fetch( event.request.clone() )
// 			.catch( () => queue.addRequest( event.request ) )
// 		;

// 		event.waitUntil( promiseChain );

// 	}
// );
