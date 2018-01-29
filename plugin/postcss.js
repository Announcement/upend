const postcss = require('postcss')

module.exports = async function _postcss (it, plugins, options) {
    let processor

    processor = postcss(plugins)
    
    return processor.process(it, options)
}