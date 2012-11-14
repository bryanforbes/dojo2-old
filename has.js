define([
	'has/detect/features',
	'has/detect/bugs',
	'has/detect/dom'
], function(has) {
	// module:
	//		dojo/has
	// summary:
	//		Defines the has.js API and several feature tests used by dojo.
	// description:
	//		This module defines the has API as described by the project has.js with the following additional features:
	//
	//			* the has test cache is exposed at has.cache.
	//			* the method has.add includes a forth parameter that controls whether or not existing tests are replaced
	//
	//		This module adopted from https://github.com/phiggins42/has.js; thanks has.js team!

	if(has('dom')){
		// Common browser tests
		has.add('host-browser', 1);
		has.add('touch', function(global, document){
			return 'ontouchstart' in document;
		});

		// Tests for DOMNode.attributes[] behavior
		// dom-attributes-explicit - attributes[] only lists explicitly user specified attributes
		// dom-attributes-specified-flag (IE8) - need to check attr.specified flag to skip attributes user didn't specify
		// Otherwise, it's IE6-7. attributes[] will list hundreds of values, so need to do outerHTML to get attrs instead.
		var form = document.createElement('form');
		has.add('dom-attributes-explicit', !form.attributes.length); // W3C
		has.add('dom-attributes-specified-flag', form.attributes.length < 40);	// IE8
	}
	has.add('host-node', typeof process === 'object' && process.versions && process.versions.node && process.versions.v8);

	return has;
});
