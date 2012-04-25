define(['exports'], function(exports){
	exports.global = this;

	exports.setGlobal = function(newGlobal){
		exports.global = newGlobal;
	};

	exports.withGlobal = function(globalObject, callback, thisObject, cbArguments){
		var oldGlobal = exports.global;
		try{
			exports.setGlobal(globalObject);

			if(thisObject && typeof callback == "string"){
				callback = thisObject[callback];
			}

			return callback.apply(thisObject, cbArguments || []);
		}finally{
			exports.setGlobal(oldGlobal);
		}
	};
});
