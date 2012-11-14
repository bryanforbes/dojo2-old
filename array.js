define(['exports', 'has'], function(exports, has){

	has.add('array-from', typeof Array.from === 'function');
	has.add('array-to', typeof Array.to === 'function');

	var slice = Array.prototype.slice;

	exports.from = has('array-from') ?
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
		};
	exports.to = has('array-to') ?
		function(){
			return Array.to.apply(Array, arguments);
		} :
		function(){
			return slice.call(arguments, 0);
		};
});
