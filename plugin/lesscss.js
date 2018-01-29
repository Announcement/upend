const lesscss = require('less')

module.exports = function _lesscss (it) {
    return new Promise(function (resolve, reject) {
        lesscss.render(it, function (error, result) {
            if (error) reject(error)
            if (result) resolve(result)
        });
    })
}