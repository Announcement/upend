const Directory = require('./utility/directory')

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

let $options = {
	fs: {
		encoding: 'utf8'
	},
}

module.exports = function ({ options, targets }) {
    main()

    async function main() {
        let directory

        directory = new Directory('.', options.directory)

        directory.on('file', file => {
            build(file)
        })

        directory.on('change#file', file => {
            build(file)
        })

        async function build(source) {
            let target
            let that
            let destination

            let content
            let result

            source = source.replace(/\\/g, '/')

            let longestName = targets.map(target => target.name.length).sort()[0] + 1
            let longestCategory = targets.map(target => target.category.length).sort()[0] + 1

            for (target of targets) {
                if (that = target.from.exec(source)) {
                    name = that[1]
                    destination = target.to(name)

                    content = await _read(source, $options.fs)
                    result = await target.build({
                        source,
                        destination,
                        content
                    })

                    await _write(destination, result, $options.fs)

                    let a = target.category.padStart(longestCategory).replace(/\S+/g, '')
                    let b = target.name.padEnd(longestName).replace(/\S+/g, '')

                    console.log(
                        a + chalk.blue(target.category),
                        '<=', target.name + b, '=>',
                        chalk.gray(name)
                    )
                }
            }
        }
    }
}

function _read(it, options) {
    return new Promise(function (resolve, reject) {
        fs.readFile(it, options, function (error, data) {
            if (error) reject(error)
            if (data) resolve(data)
        })
    })
}

function _write(it, data, options) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(it, data, function (error) {
            error ? reject(error) : resolve()
        })
    })
}

process.nextTick(() => {
    console.log('')
})

process.on('beforeExit', () => {
    console.log('')
})
