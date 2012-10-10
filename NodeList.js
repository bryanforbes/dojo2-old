define(['./has', './compose'], function(has, compose){
	var ap = Array.prototype,
		slice = ap.slice,
		splice = ap.splice,
		concat = ap.concat,
		forEach = ap.forEach,
		map = ap.map,
		filter = ap.filter;

	var NodeList = function(array){
		var instance,
			arr = array;
		if(this instanceof NodeList){
			instance = this;

			if(typeof arr === 'number'){
				arr = new Array(array);
			}
			var nodeArray = arguments.length > 1 ? arguments : arr;
			this.length = nodeArray.length;
			forEach.call(nodeArray, function(value, i){
				this[i] = value;
			}, this);
		}else{
			if(typeof arr !== 'number' && !('length' in arr)){
				arr = arguments;
			}
			instance = new NodeList(arr);
		}

		return instance;
	};

	NodeList.prototype = [];

	var wrap = function(array, parent, NodeListCtor){
		NodeListCtor = NodeListCtor || this._NodeListCtor || NodeList;

		var nl = new NodeListCtor(array);
		return parent ? nl._stash(parent) : nl;
	};
	compose.call(NodeList.prototype, {
		constructor: NodeList,
		_NodeListCtor: NodeList,
		_wrap: wrap,
		toString: function(){
			return this.join(",");
		},
		_stash: function(parent){
			this._parent = parent;
			return this;
		},
		end: function(){
			if(this._parent){
				return this._parent;
			}else{
				// return empty list
				return new this._NodeListCtor(0);
			}
		},
		// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array#Methods

		// FIXME: handle return values for #3244
		//		http://trac.dojotoolkit.org/ticket/3244

		// FIXME:
		//		need to wrap or implement:
		//			join (perhaps w/ innerHTML/outerHTML overload for toString() of items?)
		//			reduce
		//			reduceRight
		slice: function(){
			return this._wrap(
				slice.apply(this, arguments),
				this
			);
		},
		splice: function(){
			return this._wrap(
				splice.apply(this, arguments)
			);
		},
		concat: function(item){
			var t = slice.call(this, 0),
				m = map.call(arguments, function(a){
					return splice.call(a, 0);
				});

			return this._wrap(
				concat.apply(t, m),
				this
			);
		},
		forEach: function(callback, thisObj){
			forEach.call(this, callback, thisObj);
			return this;
		},
		map: function(callback, thisObj){
			return this._wrap(
				map.call(this, callback, thisObj),
				this
			);
		},
		filter: function(callback, thisObj){
			// TODO: string filtering
			return this._wrap(
				filter.call(this, callback, thisObj),
				this
			);
		},
		at: function(){
			var t = new this._NodeListCtor(0);
			forEach.call(slice.call(arguments, 0), function(i){
				if(i < 0){ i = this.length + i; }
				if(this[i]){ t.push(this[i]); }
			}, this);
			return t._stash(this);
		}
	});

	var loopBody = function(array, callback, thisObj){
		array = [0].concat(slice.call(array, 0));
		return function(node){
			array[0] = node;
			return callback.apply(thisObj, array);
		};
	};

	compose.call(NodeList, {
		_wrap: wrap,
		adaptAsForEach: function(callback, thisObj){
			return function(){
				this.forEach(loopBody(arguments, callback, thisObj));
				return this;
			};
		},
		adaptAsMap: function(callback, thisObj){
			return function(){
				return this.map(loopBody(arguments, callback, thisObj));
			};
		},
		adaptAsFilter: function(callback, thisObj){
			return function(){
				return this.filter(loopBody(arguments, callback, thisObj));
			};
		},
		adaptWithCondition: function(callback, condition, thisObj){
			return function(){
				var args = arguments,
					body = loopBody(args, callback, thisObj);
				if(condition.call(thisObj, args)){
					return this.map(body);
				}
				this.forEach(body);
				return this;
			};
		}
	});

	return NodeList;
});
