define(['exports', '../dom', '../has'], function(exports, dom, has){
	has.add('dom-classlist', function(global, document, element){
		return 'classList' in element;
	});

	// module:
	//		dojo/dom-class

	var className = "className";

	// =============================
	// (CSS) Class Functions
	// =============================

	var spaces = /\s+/, a1 = [""];

	function str2array(s){
		if(typeof s === "string" || s instanceof String){
			if(s && !spaces.test(s)){
				a1[0] = s;
				return a1;
			}
			var a = s.split(spaces);
			if(a.length && !a[0]){
				a.shift();
			}
			if(a.length && !a[a.length - 1]){
				a.pop();
			}
			return a;
		}
		// assumed to be an array
		if(!s){
			return [];
		}
		return s.filter(function(x){ return x; });
	}

	if(has('dom-classlist')){
		exports.contains = function(node, classStr){
			var classList = classStr && dom.byId(node).classList;
			return classList && classList.contains(classStr);
		};

		exports.add = function(node, classStr){
			node = dom.byId(node);
			var add = node.classList.add.bind(node.classList);
			str2array(classStr).forEach(function(str){
				add(str);
			});
		};

		exports.remove = function(node, classStr){
			node = dom.byId(node);
			if(classStr == null){
				node[className] = "";
			}else{
				var remove = node.classList.remove.bind(node.classList);
				str2array(classStr).forEach(function(str){
					remove(str);
				});
			}
		};

		exports.toggle = function(node, classStr, condition){
			if(classStr == null){
				node = dom.byId(node);
				var toggle = node.classList.toggle.bind(node.classList);
				str2array(classStr).forEach(function(str){
					toggle(str);
				});
			}else{
				exports[condition ? 'add' : 'remove'](node, classStr);
			}
			return condition;
		};

		exports.replace = function(node, from, to){
			node = dom.byId(node);
			if(classStr == null){
				node[className] = "";
			}else{
				var remove = node.classList.remove.bind(node.classList);
				str2array(classStr).forEach(function(str){
					remove(str);
				});
			}
			var add = node.classList.add.bind(node.classList);
			str2array(classStr).forEach(function(str){
				add(str);
			});
		};
	}else{
		// regular DOM version
		var fakeNode = {};  // for effective replacement
		exports.contains = function(/*DomNode|String*/ node, /*String*/ classStr){
			// summary:
			//		Returns whether or not the specified classes are a portion of the
			//		class list currently applied to the node.
			// node: String|DOMNode
			//		String ID or DomNode reference to check the class for.
			// classStr: String
			//		A string class name to look for.
			// example:
			//		Do something if a node with id="someNode" has class="aSillyClassName" present
			//	|	if(dojo.hasClass("someNode","aSillyClassName")){ ... }

			return ((" " + dom.byId(node)[className] + " ").indexOf(" " + classStr + " ") >= 0); // Boolean
		};

		exports.add = function(/*DomNode|String*/ node, /*String|Array*/ classStr){
			// summary:
			//		Adds the specified classes to the end of the class list on the
			//		passed node. Will not re-apply duplicate classes.
			//
			// node: String|DOMNode
			//		String ID or DomNode reference to add a class string too
			//
			// classStr: String|Array
			//		A String class name to add, or several space-separated class names,
			//		or an array of class names.
			//
			// example:
			//		Add a class to some node:
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.add("someNode", "anewClass");
			//	|	});
			//
			// example:
			//		Add two classes at once:
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.add("someNode", "firstClass secondClass");
			//	|	});
			//
			// example:
			//		Add two classes at once (using array):
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.add("someNode", ["firstClass", "secondClass"]);
			//	|	});
			//
			// example:
			//		Available in `dojo/NodeList` for multiple additions
			//	|	require(["dojo/query"], function(query){
			//	|		query("ul > li").addClass("firstLevel");
			//	|	});

			node = dom.byId(node);
			var cls = node[className], oldLen;
			cls = cls ? " " + cls + " " : " ";
			oldLen = cls.length;
			str2array(classStr).forEach(function(c){
				if(c && cls.indexOf(" " + c + " ") < 0){
					cls += c + " ";
				}
			});
			if(oldLen < cls.length){
				node[className] = cls.substr(1, cls.length - 2);
			}
		};

		exports.remove = function(/*DomNode|String*/ node, /*String|Array?*/ classStr){
			// summary:
			//		Removes the specified classes from node. No `contains()`
			//		check is required.
			//
			// node: String|DOMNode
			//		String ID or DomNode reference to remove the class from.
			//
			// classStr: String|Array
			//		An optional String class name to remove, or several space-separated
			//		class names, or an array of class names. If omitted, all class names
			//		will be deleted.
			//
			// example:
			//		Remove a class from some node:
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.remove("someNode", "firstClass");
			//	|	});
			//
			// example:
			//		Remove two classes from some node:
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.remove("someNode", "firstClass secondClass");
			//	|	});
			//
			// example:
			//		Remove two classes from some node (using array):
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.remove("someNode", ["firstClass", "secondClass"]);
			//	|	});
			//
			// example:
			//		Remove all classes from some node:
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.remove("someNode");
			//	|	});
			//
			// example:
			//		Available in `dojo/NodeList` for multiple removal
			//	|	require(["dojo/query"], function(query){
			//	|		query("ul > li").removeClass("foo");
			//	|	});

			node = dom.byId(node);
			var cls;
			if(classStr !== undefined){
				cls = " " + node[className] + " ";
				str2array(classStr).forEach(function(str){
					cls = cls.replace(" " + str + " ", " ");
				});
				cls = cls.trim();
			}else{
				cls = "";
			}
			if(node[className] !== cls){ node[className] = cls; }
		};

		exports.replace = function(/*DomNode|String*/ node, /*String|Array*/ removeClassStr, /*String|Array*/ addClassStr){
			// summary:
			//		Replaces one or more classes on a node if not present.
			//		Operates more quickly than calling dojo.removeClass and dojo.addClass
			//
			// node: String|DOMNode
			//		String ID or DomNode reference to remove the class from.
			//
			// addClassStr: String|Array
			//		A String class name to add, or several space-separated class names,
			//		or an array of class names.
			//
			// removeClassStr: String|Array?
			//		A String class name to remove, or several space-separated class names,
			//		or an array of class names.
			//
			// example:
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.replace("someNode", "remove1 remove2", "add1 add2");
			//	|	});
			//
			// example:
			//	Replace all classes with addMe
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.replace("someNode", null, "addMe");
			//	|	});
			//
			// example:
			//	Available in `dojo/NodeList` for multiple toggles
			//	|	require(["dojo/query"], function(query){
			//	|		query(".findMe").replaceClass("removeMe", "addMe");
			//	|	});

			node = dom.byId(node);
			fakeNode[className] = node[className];
			exports.remove(fakeNode, removeClassStr);
			exports.add(fakeNode, addClassStr);
			if(node[className] !== fakeNode[className]){
				node[className] = fakeNode[className];
			}
		};

		exports.toggle = function toggleClass(/*DomNode|String*/ node, /*String|Array*/ classStr, /*Boolean?*/ condition){
			// summary:
			//		Adds a class to node if not present, or removes if present.
			//		Pass a boolean condition if you want to explicitly add or remove.
			//		Returns the condition that was specified directly or indirectly.
			//
			// node: String|DOMNode
			//		String ID or DomNode reference to toggle a class string
			//
			// classStr: String|Array
			//		A String class name to toggle, or several space-separated class names,
			//		or an array of class names.
			//
			// condition:
			//		If passed, true means to add the class, false means to remove.
			//		Otherwise dojo.hasClass(node, classStr) is used to detect the class presence.
			//
			// example:
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.toggle("someNode", "hovered");
			//	|	});
			//
			// example:
			//		Forcefully add a class
			//	|	require(["dojo/dom-class"], function(domClass){
			//	|		domClass.toggle("someNode", "hovered", true);
			//	|	});
			//
			// example:
			//		Available in `dojo/NodeList` for multiple toggles
			//	|	require(["dojo/query"], function(query){
			//	|		query(".toggleMe").toggleClass("toggleMe");
			//	|	});

			node = dom.byId(node);
			if(condition === undefined){
				str2array(classStr).forEach(function(c){
					exports[exports.contains(node, c) ? "remove" : "add"](node, c);
				});
			}else{
				exports[condition ? "add" : "remove"](node, classStr);
			}
			return condition;   // Boolean
		};
	}
});
