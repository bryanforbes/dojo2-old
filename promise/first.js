define([
	"../Deferred",
	"../when"
], function(Deferred, when){
	"use strict";

	// module:
	//		dojo/promise/first

	return function first(/*Object|Array?*/ objectOrArray){
		// summary:
		//		Takes multiple promises and returns a new promise that is fulfilled
		//		when the first of these promises is fulfilled.
		// description:
		//		Takes multiple promises and returns a new promise that is fulfilled
		//		when the first of these promises is fulfilled. Canceling the returned
		//		promise will *not* cancel any passed promises. The promise will be
		//		fulfilled with the value of the first fulfilled promise.
		// returns: dojo/promise/Promise
		//
		// objectOrArray:
		//		The promises are taken from the array or object values. If no value
		//		is passed, the returned promise is resolved with an undefined value.
		var array;
		if(Array.isArray(objectOrArray)){
			array = objectOrArray;
		}else if(objectOrArray && typeof objectOrArray === "object"){
			array = [];
			for(var key in objectOrArray){
				if(Object.hasOwnProperty.call(objectOrArray, key)){
					array.push(objectOrArray[key]);
				}
			}
		}

		if(!array || !array.length){
			return new Deferred().resolve();
		}

		var deferred = new Deferred();
		array.forEach(function(valueOrPromise){
			when(valueOrPromise, deferred.resolve, deferred.reject);
		});
		return deferred.promise;
	};
});
