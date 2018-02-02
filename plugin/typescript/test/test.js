const vm = require('vm')
const plugin = require('../upend-typescript')

const { expect } = require('chai')

describe('@upend/plugin', function () {
	it('should be a function', function () {
		expect(plugin).to.be.a('function')
	})

	it('have exactly two arguments', function () {
		expect(plugin.length).to.equal(2)
	})

	it('should return a promise', function () {
		expect(plugin('', {})).to.be.a('promise')
	})

	it('should should exchange an input string for an output string', async function () {
		expect(await plugin('', {})).to.be.a('string')
	})

	it('should provide an object with appropriate output', async function () {
		let object = {input: ''}
		expect(await plugin(object, {})).to.be.an('object')
		expect(await plugin(object, {})).to.have.property('output')
	})
})

describe('@upend/plugin-typescript', function () {
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
		expect(await plugin('2 + 2', {})).to.be.a('string')
	})

	it ('should be predictable code', async function () {
		expect(await plugin('2 + 2', {})).to.match(/2\s*\+\s*2/)
	})

	it('should provide runnable code', async function () {
		regenerate()
		compile(await plugin('2 + 2', {}))
		expect(execute).to.not.throw()
	})

	it('should provide working code', async function () {
		regenerate()
		sandbox.number = 0
		compile(await plugin('number = 3', {}))
		execute()

		expect(sandbox.number).to.equal(3)
	})
})
