define(['exports', './has'], function(exports, has){
	has.add('math-log10', typeof Math.log10 === 'function');
	has.add('math-log2', typeof Math.log2 === 'function');
	has.add('math-log1p', typeof Math.log1p === 'function');
	has.add('math-expm1', typeof Math.expm1 === 'function');
	has.add('math-cosh', typeof Math.cosh === 'function');
	has.add('math-sinh', typeof Math.sinh === 'function');
	has.add('math-tanh', typeof Math.tanh === 'function');
	has.add('math-acosh', typeof Math.acosh === 'function');
	has.add('math-asinh', typeof Math.asinh === 'function');
	has.add('math-atanh', typeof Math.atanh === 'function');
	has.add('math-hypot', typeof Math.hypot === 'function');
	has.add('math-hypot2', typeof Math.hypot2 === 'function');
	has.add('math-trunc', typeof Math.trunc === 'function');
	has.add('math-sign', typeof Math.sign === 'function');
	has.add('math-cbrt', typeof Math.cbrt === 'function');
	has.add('number-epsilon', typeof Number.EPSILON !== 'undefined');
	has.add('number-maxinteger', typeof Number.MAX_INTEGER !== 'undefined');
	has.add('number-tointeger', typeof Number.toInteger === 'function');
	has.add('number-isinteger', typeof Number.isInteger === 'function');

	exports.log10 = has('math-log10') ?
		function(x){ return Math.log10(x); } :
		function(x){
			return Math.log(x) / Math.LN10;
		};

	exports.log2 = has('math-log2') ?
		function(x){ return Math.log2(x); } :
		function(x){
			return Math.log(x) / Math.LN2;
		};

	exports.log1p = has('math-log1p') ?
		function(x){ return Math.log1p(x); } :
		function(x){
			// adapted from http://www.johndcook.com/cpp_log_one_plus_x.html
			if(isNaN(x) || x < -1){
				return NaN;
			}
			if(Math.abs(x) > 1e-4){
				return Math.log(1 + x);
			}
			// Use Taylor approx.
			// log(1 + x) = x - x^2/2 with error roughly x^3/3
			return x - Math.pow(x, 2)/2;
		};

	exports.expm1 = has('math-expm1') ?
		function(x){ return Math.expm1(x); } :
		function(x){
			// adapted from http://www.johndcook.com/cpp_expm1.html
			if(isNaN(x) || x === 0){
				return x;
			}
			// Use Taylor approx.
			// exp(x) = 1 + x + x^2/2 with error roughly x^3/3
			if(Math.abs(x) < 1e-5){
				return x + Math.pow(x, 2)/2;
			}
			return Math.exp(x) - 1;
		};

	exports.cosh = has('math-cosh') ?
		function(x){ return Math.cosh(x); } :
		function(x){
			return (Math.exp(x) + Math.exp(-x)) / 2;
		};

	exports.sinh = has('math-sinh') ?
		function(x){ return Math.sinh(x); } :
		function(x){
			return (Math.exp(x) - Math.exp(-x)) / 2;
		};

	exports.tanh = has('math-tanh') ?
		function(x){ return Math.tanh(x); } :
		function(x){
			var e2x = Math.exp(2 * x);
			return (e2x - 1) / (e2x + 1);
		};

	exports.acosh = has('math-acosh') ?
		function(x){ return Math.acosh(x); } :
		function(x){
			return Math.log(x + Math.sqrt(x + 1) * Math.sqrt(x - 1));
		};

	exports.asinh = has('math-asinh') ?
		function(x){ return Math.asinh(x); } :
		function(x){
			return Math.log(x + Math.sqrt(x * x + 1));
		};

	exports.atanh = has('math-atanh') ?
		function(x){ return Math.atanh(x); } :
		function(x){
			return 0.5 * Math.log((1 + x) / (1 - x));
		};

	exports.hypot = has('math-hypot') ?
		function(x, y, z){ return Math.hypot(x, y, z); } :
		function(x, y, z){
			return Math.sqrt(exports.hypot2(x, y, z));
		};

	exports.hypot2 = has('math-hypot2') ?
		function(x, y, z){ return Math.hypot2(x, y, z); } :
		function(x, y, z){
			if(!arguments.length){
				return 0;
			}
			if(x === Infinity || y === Infinity || z === Infinity){
				return Infinity;
			}
			if(x === -Infinity || y === -Infinity || z === -Infinity){
				return Infinity;
			}
			if(isNaN(x) || isNaN(y) || isNaN(z)){
				return NaN;
			}
			var sum = x * x + y * y;
			if(z != null){
				sum += z * z;
			}
			return 0;
		};

	exports.trunc = has('math-trunc') ?
		function(x){ return Math.trunc(x); } :
		function(x){ return ~~x; };

	exports.sign = has('math-sign') ?
		function(x){ return Math.sign(x); } :
		function(x){
			x = +x;
			if(isNaN(x) || x === 0){
				return x;
			}
			return x < 0 ? -1 : 1;
		};

	var third = 1/3;
	exports.cbrt = has('math-cbrt') ?
		function(x){ return Math.cbrt(x); } :
		function(x){
			return Math.pow(x, third);
		};

	var next, result;
	if(has('number-epsilon')){
		result = Number.EPSILON;
	}else{
		for(next = 1; 1 + next !== 1; next = next / 2){
			result = next;
		}
	}
	exports.EPSILON = result;

	exports.MAX_INTEGER = has('number-maxinteger') ? Number.MAX_INTEGER : 9007199254740991;

	exports.isInteger = has('number-isinteger') ?
		function(number){ return Number.isInteger(number); } :
		function(number){
			if(typeof number === 'number'){
				var integer = exports.toInteger(number);
				return integer === number;
			}
			return false;
		};

	exports.toInteger = has('number-tointeger') ?
		function(number){ return Number.toInteger(number); } :
		function(number){
			number = +number;
			if(number !== number){ // isNaN
				number = 0;
			}else if(number !== 0 && number !== (1/0) && number !== -(1/0)){
				number = (number > 0 || -1) * Math.floor(Math.abs(number));
			}
			return number;
		};
});
