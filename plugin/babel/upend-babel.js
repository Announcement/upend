const babel = require('@babel/core')

module.exports = async function plugin_babel (it, options) {
	let input

	input = exists(it.input) ? it.input : it

	return await (new Promise(function (resolve, reject) {
		exists(options) ?
			babel.transform(input, options, callback) :
			babel.transform(input, callback)

		function callback (error, result) {
			if (error) reject(error)
			if (result) typeof it === 'string' ?
				resolve(result.code) :
				resolve({ output: result.code, map: result.map, extra: result })
		};
	}))

	function exists (it) {
		return it !== undefined && it !== null
	}
}
