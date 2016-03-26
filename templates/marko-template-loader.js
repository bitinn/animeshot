
/**
 * marko-template-loader.js
 *
 * A simple helper to avoid having to load 
 */

var marko = require('marko')

module.exports = loader

/**
 * Load and return a template renderer
 *
 * @param   String  path  Relative path to template
 * @return  Object        Marko template
 */
function loader(path) {
	return marko.load(require.resolve(path));
}
