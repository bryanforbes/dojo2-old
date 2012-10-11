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
					if(x === y){
						return x !== 0 || 1 / x === 1 / y;
					}
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
