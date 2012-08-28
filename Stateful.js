define(['./when', './aspect'], function(when, aspect){
	var slice = [].slice;

	function Stateful(properties){
		if(properties){ this.set(properties); }
	}

	Stateful.prototype = {
		constructor: Stateful,

		_propNames: {},
		_getPropNames: function(name){
			var pn = this._propNames;
			if(pn[name]){
				return pn[name];
			}
			return pn[name] = {
				s: '_get_' + name,
				g: '_set_' + name
			};
		},

		get: function(name){
			var getterName = this._getPropNames(name).g;
			return typeof this[getterName] === 'function' ? this[getterName]() : this[name];
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

			var setterName = this._getPropNames(name).s,
				setter = this[setterName],
				oldValue = this.get(name),
				result;

			if(typeof setter === 'function'){
				result = setter.apply(this, slice.call(arguments, 1));
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
	};

	return Stateful;
});
