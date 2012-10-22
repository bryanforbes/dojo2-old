define(['exports', './has'], function(exports, has){
	has.add('object-is', typeof Object.is === 'function');
	has.add('object-isnt', typeof Object.isnt === 'function');

	exports.is = has('object-is') ?
		function(x, y){
			return Object.is(x, y);
		} :
		function(x, y){
			// taken from http://wiki.ecmascript.org/doku.php?id=harmony:egal
			if(x === y){
				// 0 === -0, but they aren't identical
				return x !== 0 || 1 / x === 1 / y;
			}

			// NaN !== NaN, but they are identical
			// NaNs are the only non-reflexive value, i.e., if x !== x,
			// then x is a NaN.
			// isNaN is broken: it converts its argument to number, so
			// isNaN("foo") => true
			return x !== x && y !== y;
		};

	exports.isnt = has('object-isnt') ?
		function(x, y){
			return Object.isnt(x, y);
		} :
		has('object-is') ?
			function(x, y){
				return !Object.is(x, y);
			} :
			function(x, y){
				return !exports.is(x, y);
			};

	exports.forIn = function(object, callback, thisObject){
		thisObject = thisObject || null;
		for(var key in object){
			callback.call(thisObject, object[key], key, object);
		}
	};

	var hop = {}.hasOwnProperty;
	exports.forOwn = function(object, callback, thisObject){
		thisObject = thisObject || null;
		for(var key in object){
			if(hop.call(object, key)){
				callback.call(thisObject, object[key], key, object);
			}
		}
	};

	function copy(funcName){
		return function(target, source, copyFunc){
			exports[funcName](source, copyFunc || function(value, key){
				target[key] = value;
			});
			return target;
		};
	}
	exports.copy = copy('forIn');
	exports.copyOwn = copy('forOwn');

	exports.defineProperty = function(object, key, value){
		var property = {
			enumerable: true,
			writable: true,
			configurable: true
		};
		if(typeof value === 'object' && value && !Array.isArray(value) &&
			(hop.call(value, 'value') || hop.call(value, 'get') || hop.call(value, 'set')) &&
			(hop.call(value, 'enumerable') || hop.call(value, 'configurable') || hop.call(value, 'writable'))){
				exports.copy(property, value);
				if(hop.call(property, 'get') || hop.call(property, 'set')){
					delete property.writable;
				}
		}else{
			property.value = value;
		}
		return Object.defineProperty(object, key, property);
	};

	exports.defineProperties = function(object, properties){
		exports.forOwn(properties, function(value, key){
			exports.defineProperty(object, key, value);
		});
		return object;
	};

	exports.get = function(context, lookup){
		if(!context){
			return null;
		}
		var parts = lookup.split('.'),
			i = 0,
			p;
		while(context && (p = parts[i++])){
			context = (p in context ? context[p] : undefined);
		}
		return context;
	};
});
