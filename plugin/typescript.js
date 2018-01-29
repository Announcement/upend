const typescript = require('typescript')

module.exports = async function _typescript (it, options) {
    return typescript.transpileModule(it, options)
}