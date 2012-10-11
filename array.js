define(['exports', './has'], function(exports, has){

	has.add('array-from', typeof Array.from === 'function');
	has.add('array-to', typeof Array.to === 'function');

	var slice = Array.prototype.slice;

	Object.defineProperties(exports, {
		from: {
			value: has('array-from') ?
				function(arrayLike){
					return Array.from(arrayLike);
				} :
				function(arrayLike){
					var array = [], l = arrayLike.length;
					for(var i=0; i<l; i++){
						if(arrayLike.hasOwnProperty(i)){
							array[i] = arrayLike[i];
						}
					}
				},
			enumerable: true,
			configurable: true,
			writable: true
		},
		to: {
			value: has('array-to') ?
				function(){
					return Array.to.apply(Array, arguments);
				} :
				function(){
					return slice.call(arguments, 0);
				},
			enumerable: true,
			configurable: true,
			writable: true
		}
	});
});
