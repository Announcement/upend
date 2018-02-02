const typescript = require('typescript')

/**
 * Intended as a plugin for upend, but is useful without it.
 *
 * @summary Standardized Typescript compiler.
 *
 * @async
 * @function build
 *
 * @param {string | object} it - Typescript source to be compiled.
 * @param {object} options - Typescript compiler options to use for compiling.
 *
 * @returns {string | object} Javascript compiled from Typescript.
 * @version 2
 * @since 1.0.0
 */
module.exports = async function plugin_typescript (it, options) {
	let result
	let input

	input = exists(it.input) ? it.input : it

	result = await typescript.transpileModule(input, options)

	if (typeof it === 'string') {
		return result.outputText
	}

	if (typeof it === 'object') {
		return {
			output: result.outputText,
			map: result.sourceMapText,
			extra: result
		}
	}

	return result

	function exists (it) {
		return it !== null && it !== undefined
	}
}
