const plugin = require('../upend-babel')
const vm = require('vm')
const { expect } = require('chai')

describe('@upend/plugin', function () {
	it('should be a function', function () {
		expect(plugin).to.be.a('function')
	})

	it('have exactly two arguments', function () {
		expect(plugin.length).to.equal(2)
	})

	it('should return a promise', function () {
		expect(plugin('', { babelrc: false })).to.be.a('promise')
	})

	it('should should exchange an input string for an output string', async function () {
		expect(await plugin('', { babelrc: false })).to.be.a('string')
	})

	it('should provide an object with appropriate output', async function () {
		let object = {input: ''}
		expect(await plugin(object, { babelrc: false })).to.be.an('object')
		expect(await plugin(object, { babelrc: false })).to.have.property('output')
	})
})

describe('@upend/plugin-babel', function () {
	let source
	let transpiled
	let context
	let script
	let sandbox
	let output

	function regenerate () {
		sandbox = {}
		sandbox.module = {}
		sandbox.module.exports = {}
		sandbox.exports = sandbox.module.exports
	}

	function compile (it) {
		context = vm.createContext(sandbox)
		script = new vm.Script(it)
	}

	function execute () {
		output = script.runInContext(context)
	}

	it ('should transpile code', async function () {
		expect(await plugin('2 + 2', { babelrc: false })).to.be.a('string')
	})

	it ('should be predictable code', async function () {
		expect(await plugin('2 + 2', { babelrc: false })).to.match(/2\s*\+\s*2/)
	})

	it('should provide runnable code', async function () {
		regenerate()
		compile(await plugin('2 + 2', { babelrc: false }))
		expect(execute).to.not.throw()
	})

	it('should provide working code', async function () {
		regenerate()
		sandbox.number = 0
		compile(await plugin('number = 3', { babelrc: false }))
		execute()

		expect(sandbox.number).to.equal(3)
	})
})
