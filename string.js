define(['exports', './has'], function(exports, has){
	var sp = String.prototype;

	has.add('string-startswith', typeof sp.startsWith === 'function');
	has.add('string-endswith', typeof sp.endsWith === 'function');
	has.add('string-contains', typeof sp.contains === 'function');
	has.add('string-repeat', typeof sp.repeat === 'function');
	has.add('string-toarray', typeof sp.toArray === 'function');

	exports.startsWith = has('string-startswith') ?
		function(string, search, position){
			return string.startsWith(search, position);
		} :
		function(string, search, position){
			string = '' + string;
			search = '' + search;
			position = Math.min(Math.max(position || 0, 0), string.length);
			return !string.indexOf(search, position);
		};
	exports.endsWith = has('string-endswith') ?
		function(string, search, position){
			return string.endsWith(search, position);
		} :
		function(string, search, position){
			string = '' + string;
			search = '' + search;
			position = Math.min(Math.max(position || 0, 0), string.length);
			var start = position - search.length;
			if(start < 0){
				return false;
			}
			return string.slice(start, start + search.length) === search;
		};
	exports.contains = has('string-contains') ?
		function(string, search, position){
			return string.contains(search, position);
		} :
		function(string, search, position){
			string = '' + string;
			search = '' + search;
			position = Math.min(Math.max(position || 0, 0), string.length);
			return string.indexOf(search, position) !== -1;
		};
	exports.repeat = has('string-repeat') ?
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
		};
	exports.toArray = has('string-toarray') ?
		function(string){
			return string.toArray();
		} :
		function(string){
			return string.split('');
		};
});
