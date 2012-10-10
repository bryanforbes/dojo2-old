define(['../on', '../query'], function(on, query){
	function delegate(target, selector, type, listener, capture){
		return delegate.selector(selector, type).call(this, target, listener, capture);
	}

	delegate.selector = function(selector, eventType, children){
		// summary:
		//		Creates a new extension event with event delegation. This is based on
		//		the provided event type (can be extension event) that
		//		only calls the listener when the CSS selector matches the target of the event.
		//	selector:
		//		The CSS selector to use for filter events and determine the |this| of the event listener.
		//	eventType:
		//		The event to listen for
		// children:
		//		Indicates if children elements of the selector should be allowed. This defaults to
		//		true
		//	example:
		//		define(["dojo/on", "dojo/mouse", "dojo/query!css2"], function(listen, mouse){
		//			on(node, on.selector(".my-class", mouse.enter), handlerForMyHover);
		return function(target, listener, capture){
			var matchesTarget = typeof selector === 'function' ? { matches: selector } : this,
				bubble = eventType.bubble;

			if(typeof selector === 'function'){
				matchesTarget = { matches: selector };
			}else if(this && this.matches){
				matchesTarget = this;
			}else{
				matchesTarget = query;
			}

			function select(eventTarget){
				while(!matchesTarget.matches(eventTarget, selector, target)){
					if(eventTarget === target || children === false || !(eventTarget = eventTarget.parentNode) || eventTarget.nodeType !== 1){ // intentional assignment
						return;
					}
				}
				return eventTarget;
			}

			if(bubble){
				// the event type doesn't naturally bubble, but has a bubbling form, use that, and give it the selector so it can perform the select itself
				return on(target, bubble(select), listener, capture);
			}

			// standard event delegation
			return on(target, eventType, function(event){
				// call select to see if we match
				var eventTarget = select(event.target);
				// if it matches we call the listener
				return eventTarget && listener.call(eventTarget, event);
			});
		};
	};

	return delegate;
});
