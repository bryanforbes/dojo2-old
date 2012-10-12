define(["./compose", "./aspect", "./on"], function(compose, aspect, on){
	//	module:
	//		dojo/Evented
	//	summary:
	//		The export of this module is a class that can be used as a mixin or base class,
	//		to add on() and emit() methods to a class
	//		for listening for events and emitting events:
	//
	//		|	define(["dojo/Evented", "dijit/_Widget"], function(Evented, _Widget){
	//		|		var EventedWidget = Evented.extend(_Widget, {...});
	//		|		widget = new EventedWidget();
	//		|		widget.on("open", function(event){
	//		|		... do something with event
	//		|	});
	//		|
	//		|	widget.emit("open", {name:"some event", ...});

	"use strict";
	var after = aspect.after;
	return compose({
		on: function(type, listener){
			return on.parse(this, type, listener, function(target, type){
				return after(target, 'on' + type, listener, true);
			});
		},
		emit: function(type, event){
			var args = [this];
			args.push.apply(args, arguments);
			return on.emit.apply(on, args);
		}
	});
});
