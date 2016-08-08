const assert = require('assert')
const fs = require('fs')
const parse = require('../')
const path = require('path')

const getFixturePath = function(filename) {
  return path.join(__dirname, 'fixture', filename)
}

describe('stream pipe', function() {

  it('parses front matter', function(done) {
    var called = false
    var buffer = []
    fs.createReadStream(getFixturePath('with-data.md'))
      .pipe(parse())
      .on('frontmatter', function(data) {
        called = true
        assert.deepEqual(data, {foo: 'bar'})
      })
      .on('data', function(chunk) {
        buffer.push(chunk)
      })
      .on('end', function(content) {
        buffer = Buffer.concat(buffer).toString()
        assert.equal(buffer.trim(), 'baz')
        done()
      })
  })

  it('parses without front matter', function() {
    var buffer = []
    fs.createReadStream(getFixturePath('with-data.md'))
      .pipe(parse())
      .on('frontmatter', function(data) {
        assert.deepEqual(undefined, data)
      })
      .on('data', function(chunk) {
        buffer.push(chunk)
      })
      .on('end', function(content) {
        buffer = Buffer.concat(buffer).toString()
        assert.equal(buffer.trim(), 'foo bar baz')
        done()
      })
  })

})
