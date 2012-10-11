define(['exports', './has'], function(exports, has){
	has.add('object-is', typeof Object.is === 'function');
	has.add('object-isnt', typeof Object.isnt === 'function');

	Object.defineProperties(exports, {
		is: {
			value: has('object-is') ?
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
				},
			enumerable: true,
			configurable: true,
			writable: true
		},
		isnt: {
			value: has('object-isnt') ?
				function(x, y){
					return Object.isnt(x, y);
				} :
				has('object-is') ?
					function(x, y){
						return !Object.is(x, y);
					} :
					function(x, y){
						return !exports.is(x, y);
					},
			enumerable: true,
			configurable: true,
			writable: true
		}
	});
});
