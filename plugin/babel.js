const babel = require('@babel/core')

module.exports = function _babel (it, options) {
    return new Promise(function (resolve, reject) {
        babel.transform(it, options, function (error, result) {
            if (error) reject(error)
            if (result) resolve(result)
        });
    })
}