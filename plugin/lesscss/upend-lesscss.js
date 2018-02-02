const lesscss = require('less')

module.exports = async function plugin_lesscss (it, options) {
	let input

	input = exists(it.input) ? it.input : it

  return await (new Promise(function (resolve, reject) {
		exists(options) ?
			lesscss.render(input, options, callback) :
			lesscss.render(input, callback)

		function callback (error, result) {
				if (error) reject(error)
				if (result) typeof it === 'string' ?
					resolve(result.css) :
					resolve({ output: result.css, map: result.map, extra: result })
		}
  }))

	function exists (it) {
		return it !== undefined && it !== null
	}
}
