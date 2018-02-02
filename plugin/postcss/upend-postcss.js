const postcss = require('postcss')

module.exports = async function plugin_postcss (it, {plugins, options}) {
		let input
    let processor
		let result

		input = exists(it.input) ? it.input : it

		if (!plugins) plugins = []
		if (!options) options = {}

    processor = postcss(plugins)
		result = await processor.process(input, options)

		if (typeof it === 'string') {
			return result.css
		}

		return {
			output: result.content,
			map: result.map,
			extra: result
		}

		function exists (it) {
			return it !== undefined && it !== null
		}
}
