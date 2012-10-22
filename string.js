define(['exports', './has', './object'], function(exports, has, object){
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

			if(count <= 0 || !string){
				return '';
			}
			var buf = [];
			while(true){
				if(count & 1){
					buf.push(string);
				}
				if(!(count >>= 1)){ break; }
				string += string;
			}
			return buf.join('');
		};
	exports.toArray = has('string-toarray') ?
		function(string){
			return string.toArray();
		} :
		function(string){
			return string.split('');
		};

	function pad(text, size, ch){
		if(!ch){
			ch = '0';
		}
		return exports.repeat(ch, Math.ceil((size - text.length) / ch.length));
	}

	exports.padr = function(text, size, ch){
		text = '' + text;
		return text + pad(text, size, ch);
	};
	exports.padl = function(text, size, ch){
		text = '' + text;
		return pad(text, size, ch) + text;
	};
	var subRE = /\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g;
	exports.substitute = function(template, map, transform, formatterObject){
		if(typeof transform === 'object'){
			formatterObject = transform;
			transform = null;
		}
		transform = transform || function(v){ return v; };
		return template.replace(
			subRE,
			function(match, key, format){
				var value = object.get(map, key);
				if(format){
					if(!formatterObject){
						throw new Error('Formatter object not provided to substitute');
					}
					var formatter = object.get(formatterObject, format);
					if(!formatter){
						throw new Error('Formatter "' + format + '" not found on formatter object');
					}else if(!formatter.call){
						throw new Error('Formatter "' + format +'" is not callable');
					}
					value = formatter.call(formatterObject, value, key);
				}
				return '' + transform(value, key);
			}
		);
	};
});
