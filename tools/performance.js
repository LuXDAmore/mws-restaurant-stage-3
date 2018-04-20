/* Check Performances */
/* https://developers.google.com/web/updates/2016/06/performance-observer */
/* https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/ */
(
	function( window ) {

		const observer = new PerformanceObserver(
			list => {

				window.console.groupCollapsed( '%c [ PERFORMANCE TABLE ✌️: longtask ]', 'color:#f1c40f' );

				const entry = list.getEntries();

				for( let i = 0; i < entry.length; i ++ ) {

					for( let j = 0; j < entry[ i ].attribution.length; j ++ )
						window.console.table( entry[ i ].attribution[ j ].toJSON() );

				};

				window.console.groupEnd();

			}
		);

		observer.observe(
			{
				entryTypes: [
					'longtask',
				],
			}
		);

		/* Interactive Timing API */
		function measureCRP() {

			window.removeEventListener( 'load', measureCRP );

			const t = window.performance.timing
				, interactive = t.domInteractive - t.domLoading
				, dcl = t.domContentLoadedEventStart - t.domLoading
				, complete = t.domComplete - t.domLoading
				, result = {
					interactive,
					dcl,
					complete,
				}
			;

			window.console.debug( '%c [ INTERACTIVE ]', 'color:#f1c40f', result );

		};
		window.addEventListener( 'load', measureCRP, false );

	}
)( window )
