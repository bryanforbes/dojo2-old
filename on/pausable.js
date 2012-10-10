define(['../on'], function(on){
	function pausable(eventType){
		//	summary:
		//		Extension event for pausable connections.
		var paused;
		return function(target, listener, capture){
			var signal = on(target, eventType, function(){
				if(!paused){
					return listener.apply(this, arguments);
				}
			}, capture);

			signal.pause = function(){
				paused = 1;
			};
			signal.resume = function(){
				paused = 0;
			};

			return signal;
		};
	}

	return pausable;
});
