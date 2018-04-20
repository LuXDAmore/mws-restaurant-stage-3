// TODO: ADD custom background-sync
// https://github.com/webmaxru/pwatter/blob/workbox/dist/sw.js
/*
	workbox.routing.registerRoute(
		new RegExp( /^http[s]?:\/\/localhost:1337\/restaurants\/[1,9]\/reviews[\/]?/ ),
		workbox.strategies.networkOnly(
			{
				plugins: [
					new workbox.backgroundSync.Plugin(
						'reviewsQueue',
						{
							maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
						}
					)
				]
			}
		),
		'POST'
	);
*/
