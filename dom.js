define([
	'exports',
	'has/detect/bugs',
	'has/detect/dom'
], function(exports, has){
	// module:
	//		dojo/dom
	// summary:
	//		This module defines the core dojo DOM API.

	// =============================
	// DOM Functions
	// =============================

	/*=====
	dom.byId = function(id, doc){
		// summary:
		//		Returns DOM node with matching `id` attribute or `null`
		//		if not found. If `id` is a DomNode, this function is a no-op.
		//
		// id: String|DOMNode
		//		A string to match an HTML id attribute or a reference to a DOM Node
		//
		// doc: Document?
		//		Document to work in. Defaults to `document`. Can be used to retrieve
		//		node references from other documents.
		//
		// example:
		//		Look up a node by ID:
		//	|	var n = dom.byId('foo');
		//
		// example:
		//		Check if a node exists, and use it.
		//	|	var n = dom.byId('bar');
		//	|	if(n){ doStuff() ... }
		//
		// example:
		//		Allow string or DomNode references to be passed to a custom function:
		//	|	var foo = function(nodeOrId){
		//	|		nodeOrId = dom.byId(nodeOrId);
		//	|		// ... more stuff
		//	|	}
	};
	=====*/

	/*=====
	dom.isDescendant = function(node, ancestor){
		// summary:
		//		Returns true if node is a descendant of ancestor
		// node: DOMNode|String
		//		string id or node reference to test
		// ancestor: DOMNode|String
		//		string id or node reference of potential parent to test against
		//
		// example:
		//		Test is node id="bar" is a descendant of node id="foo"
		//	|	if(dom.isDescendant('bar', 'foo')){ ... }
	};
	=====*/

	var global = this;

	if(has('bug-getelementbyid-ids-names') || has('bug-getelementbyid-ignores-case')){
		exports.byId = function(id, doc){
			if(typeof id !== 'string'){
				return id;
			}
			var _d = doc || document, te = id && _d.getElementById(id);
			// attributes.id.value is better than just id in case the
			// user has a name=id inside a form
			if(te && (te.attributes.id.value === id || te.id === id)){
				return te;
			}else{
				var eles = _d.all[id];
				if(!eles || eles.nodeName){
					eles = [eles];
				}
				// if more than 1, choose first with the correct id
				var i = 0;
				while((te = eles[i++])){
					if((te.attributes && te.attributes.id && te.attributes.id.value === id) || te.id === id){
						return te;
					}
				}
			}
		};
	}else{
		exports.byId = function(id, doc){
			// inline'd type check.
			// be sure to return null per documentation, to match IE branch.
			return ((typeof id === 'string') ? (doc || document).getElementById(id) : id) || null; // DOMNode
		};
	}

	if(has('bug-contains')){
		exports.isDescendant = function(/*DOMNode|String*/node, /*DOMNode|String*/ancestor){
			try{
				node = exports.byId(node);
				ancestor = exports.byId(ancestor);
				while(node){
					if(node === ancestor){
						return true; // Boolean
					}
					node = node.parentNode;
				}
			}catch(e){ /* squelch, return false */ }
			return false; // Boolean
		};
	}else{
		exports.isDescendant = function(node, ancestor){
			node = exports.byId(node);
			ancestor = exports.byId(ancestor);
			if(node === ancestor){
				return true;
			}
			return ancestor.contains(node);
		};
	}

	// Common feature tests
	has.add('dom-qsa', function(global, document, element){
		return !!element.querySelectorAll;
	});
	has.add('dom-matches-selector', function(global, document, element){
		return !!(
			// IE9, WebKit, Firefox have this, but not Opera yet
			element.matchesSelector ||
			element.webkitMatchesSelector ||
			element.mozMatchesSelector ||
			element.msMatchesSelector ||
			element.oMatchesSelector
		);
	});
});
