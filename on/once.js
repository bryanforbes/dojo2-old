define(['../on'], function(on){
	function once(eventType){
		//	summary:
		//		Extension event for one-type connections.
		return function(target, listener, capture){
			var signal = on(target, eventType, function(){
				// remove this listener
				signal.remove();
				// proceed to call the listener
				return listener.apply(this, arguments);
			});
			return signal;
		};
	}

	return once;
});
