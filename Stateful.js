define(['./compose', './when', './aspect'], function(compose, when, aspect){
	var slice = [].slice;

	var Stateful = compose(function(properties){
		if(properties){
			this.set(properties);
		}
	},{
		get: function(name){
			var descriptors = this.__descriptors || {},
				descriptor = descriptors[name] || {},
				get = descriptor.get;

			return get ? get.call(this) : this[name];
		},

		set: function(name, value){
			if(typeof name === 'object' && name){
				for(var prop in name){
					if(name.hasOwnProperty(prop)){
						this.set(prop, name[prop]);
					}
				}
				return this;
			}

			var descriptors = this.__descriptors || {},
				descriptor = descriptors[name] || {},
				oldValue = this.get(name),
				set = descriptor.set;

			if(set){
				result = set.apply(this, slice.call(arguments, 1));
			}else{
				this[name] = value;
			}

			if(this.__callbacks){
				var self = this;

				when(result, function(){
					self.__callbacks(name, value, oldValue);
				});
			}

			return this;
		},

		watch: function(name, callback){
			var callbacks = this.__callbacks,
				self = this;
			if(!callbacks){
				callbacks = this.__callbacks = function(name, value, oldValue){
					// Call name-specific watchers with (newValue, oldValue)
					callbacks['_' + name] && callbacks['_' + name].call(self, value, oldValue);
					// Call non-name-specific (global) watchers with (name, newValue, oldValue)
					callbacks['*'] && callbacks['*'].call(self, name, value, oldValue);
				};
			}
			if(!callback && typeof name === 'function'){
				callback = name;
				name = '*';
			}else{
				// prepend with an underscore to prevent conflicts with function properties
				name = '_' + name;
			}

			return aspect.after(callbacks, name, callback, true);
		}
	});

	var hasOwn = {}.hasOwnProperty;
	Stateful.defineProperty = function(descriptor){
		if(!descriptor || typeof descriptor !== 'object'){
			throw new TypeError('Property description must be an object: ' + descriptor);
		}

		return new compose.Decorator(function(key){
			var prototype = this,
				descriptors = prototype.__descriptors || (prototype.__descriptors = {}),
				d;

			// If descriptors exists, but it's not on this prototype, create the object
			// on the prototype and delegate it from the parent prototype's property so
			// there is inheritance for descriptors.
			if(descriptors && !hasOwn.call(prototype, '__descriptors')){
				descriptors = prototype.__descriptors = compose.create(prototype.__descriptors);
			}

			d = descriptors[key] = {};

			if(hasOwn.call(descriptor, 'get')){
				if(typeof descriptor.get !== 'function'){
					throw new TypeError('Getter must be a function: ' + descriptor.get);
				}
				d.get = descriptor.get;
			}
			if(hasOwn.call(descriptor, 'set')){
				if(typeof descriptor.set !== 'function'){
					throw new TypeError('Setter must be a function: ' + descriptor.set);
				}
				d.set = descriptor.set;
			}
		});
	};

	return Stateful;
});
