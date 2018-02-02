const plugin = require('../upend-lesscss')

const { expect } = require('chai')

describe('@upend/plugin', function () {
	it('should be a function', function () {
		expect(plugin).to.be.a('function')
	})

	it('have exactly two arguments', function () {
		expect(plugin.length).to.equal(2)
	})

	it('should return a promise', function () {
		expect(plugin('', { options: { from: null } })).to.be.a('promise')
	})

	it('should should exchange an input string for an output string', async function () {
		expect(await plugin('', { options: { from: null } })).to.be.a('string')
	})

	it('should provide an object with appropriate output', async function () {
		let object = { input: '' }
		expect(await plugin(object, { options: { from: null } })).to.be.an('object')
		expect(await plugin(object, { options: { from: null } })).to.have.property('output')
	})
})

describe('@upend/plugin-lesscss', function () {
	let string = 'html, body { margin: 0; padding: 0; height: 100%; }'
	let pattern = /html\,\s*body\s*\{\s*margin:\s*0;\s*padding:\s*0;\s*height:\s*100%;\s*\}/

	it('should transpile code', async function () {
		expect(await plugin(string)).to.be.a('string')
	})

	it('should provide predictable code', async function () {
		expect(await plugin(string)).to.match(pattern)
	})
})
