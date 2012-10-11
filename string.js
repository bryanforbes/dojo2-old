define(['exports', './has'], function(exports, has){
	var sp = String.prototype;

	has.add('string-startswith', typeof sp.startsWith === 'function');
	has.add('string-endswith', typeof sp.endsWith === 'function');
	has.add('string-contains', typeof sp.contains === 'function');
	has.add('string-repeat', typeof sp.repeat === 'function');
	has.add('string-toarray', typeof sp.toArray === 'function');

	Object.defineProperties(exports, {
		startsWith: {
			value: has('string-startswith') ?
				function(string, search){
					return string.startsWith(search);
				} :
				function(string, search){
					return !string.indexOf(search);
				},
			enumerable: true,
			configurable: true,
			writable: true
		},
		endsWith: {
			value: has('string-endswith') ?
				function(string, search){
					return string.endsWith(search);
				} :
				function(string, search){
					search = search + '';
					var i = string.lastIndexOf(search);
					return i >= 0 && i === (string.length - search.length);
				},
			enumerable: true,
			configurable: true,
			writable: true
		},
		contains: {
			value: has('string-contains') ?
				function(string, search){
					return string.contains(search);
				} :
				function(string, search){
					return string.indexOf(search) !== -1;
				},
			enumerable: true,
			configurable: true,
			writable: true
		},
		repeat: {
			value: has('string-repeat') ?
				function(string, count){
					return string.repeat(count);
				} :
				function(string, count){
					string = string + '';
					var result = '';
					while(--count >= 0){
						result += string;
					}
					return result;
				},
			enumerable: true,
			configurable: true,
			writable: true
		},
		toArray: {
			value: has('string-toarray') ?
				function(string){
					return string.toArray();
				} :
				function(string){
					return string.split('');
				},
			enumerable: true,
			configurable: true,
			writable: true
		}
	});
});
