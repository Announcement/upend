const fs = require('fs')
const path = require('path')

const { EventEmitter } = require('events')

let _private

_private = new WeakMap()

// directory.on('directory', directory => {})
// directory.on('file', file => {})
// directory.on(watch event + '#directory', directory => {})
// directory.on(watch event + '#file', file => {})

// for initialization configuration options see: static get configuration ()

class Directory extends EventEmitter {
    constructor(source, options) {
        super()

        this.source = source
        this.configuration = options || {}

        this.initialize()
    }

    async watch(item) {
        let options = {}
        let cache = {}

        options.recursive = this.configuration.recursive

        fs.watch(item, options, async (event, filename) => {
            let stats
            let where
            let variety

            where = path.join(item, filename)
            stats = await _stat(where)
            variety = stats.isFile() ? 'file' : stats.isDirectory() ? 'directory' : ''

            if (cache.hasOwnProperty(where) && cache[where] === stats.mtime.getTime()) {
                return false
            }

            cache[where] = stats.mtime.getTime()

            this.emit(event, filename)
            this.emit(`${event}#${variety}`, filename)
        })
    }

    async file(item) {
        if (exists(this.configuration.ignore)) {
            if (this.isIgnored(item)) return false
        }

        this.files.push(item)

        this.emit('file', item)
    }

    async directory(item) {
        let each
        let them
        let search = async it => this.configuration.order ?
            await this.search(path.join(item, it)) : this.search(path.join(item, it))

        if (exists(this.configuration.ignore)) {
            if (this.isIgnored(item)) return false
        }

        this.directories.push(item)

        this.emit('directory', item)

        them = await _readdir(item)

        if (this.configuration.order) {
            them = them.sort()
        }

        if (this.configuration.recursive === false) {
            this.configuration.recursive = 1
        }

        if (this.configuration.recursive === 1) {
            for (each of them) await search(each)

            this.configuration.recursive = 0
        }

        if (this.configuration.recursive === true) {
            for (each of them) await search(each)
        }

        return item
    }

    async search(item) {
        let stats = await _stat(item)
        let file = async () => stats.isFile() && await this.file(item)
        let directory = async () => stats.isDirectory() && await this.directory(item)

        if (exists(this.configuration.ignore)) {
            if (this.isIgnored(item)) return false
        }

        if (this.configuration.order) {
            await directory()
            await file()
        } else {
            file()
            directory()
        }
    }

    initialize() {
        this.files = []
        this.directories = []

        if (this.configuration.immediate) {
            this.search(this.source)
        }

        if (this.configuration.watch) {
            this.watch(this.source)
        }

        delete this.source
    }

    isIgnored(item, expressions) {
        if (!expressions) {
            expressions = this.configuration.ignore
        }

        if (Array.isArray(expressions)) {
            return !expressions.some(expression => this.isIgnored(item, expression))
        }

        if (typeof expressions === 'string') {
            return expressions.indexOf(item) !== -1
        }

        if (this.configuration.ignore instanceof RegExp) {
            return expressions.test(item)
        }

        if (typeof expressions === 'function') {
            return expressions(item)
        }
    }

    set configuration(options) {
        let configuration

        configuration = this.configuration

        for (let [key, value] of Object.entries(this.constructor.configuration)) {
            configuration[key] =
                exists(options[key]) ? options[key] :
                exists(configuration[key]) ? configuration[key] :
                exists(value) && value
        }

        _private.set(this, configuration)
    }

    get configuration() {
        if (!_private.has(this)) {
            _private.set(this, {})
        }

        return _private.get(this)
    }

    static get configuration() {
        // these are the default values.
        return {
            // invoke immediately or require search() and watch() to be called manually?
            // do note that if you use it this way you could effectively watch multiple directories with one Directory instance.
            immediate: true,

            // some ordering of output using pure magic (and patience)
            order: true,

            // without this the searches and watches will be shallow.
            recursive: true,

            // if invoked immediately, should we also watch?
            // if not invoked immediately this does nothing.
            watch: false,

            // what to ignore, can be a string to compare to (not a glob), a regular expression, or a function, or an array thereof.
            ignore: null
        }
    }
}


function _stat (it, options) {
    return new Promise(function (resolve, reject) {
        fs.stat(it, function (error, stats) {
            if (error) {
                reject(error)
            } else {
                resolve(stats)
            }
        })
    })
}

function _readdir (it, options) {
    return new Promise(function (resolve, reject) {
        fs.readdir(it, options, function (error, files) {
            if (error) {
                reject(error)
            } else {
                resolve(files)
            }
        })
    })
}

function exists (it) {
    return it !== undefined && it !== null
}

module.exports = Directory