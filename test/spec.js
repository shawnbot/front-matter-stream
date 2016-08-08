const assert = require('assert')
const fs = require('fs')
const parse = require('../')
const path = require('path')
const concat = require('concat-stream')

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
      .pipe(concat(function(buffer) {
        assert.equal(String(buffer).trim(), 'baz')
        done()
      }))
  })

  it('parses without front matter', function() {
    var buffer = []
    fs.createReadStream(getFixturePath('with-data.md'))
      .pipe(parse())
      .on('frontmatter', function(data) {
        assert.deepEqual(undefined, data)
      })
      .pipe(concat(function(buffer) {
        assert.equal(String(buffer).trim(), 'foo bar baz')
        done()
      }))
  })

  it('throws errors on malformed frontmatter', function(done) {
    var buffer = []
    fs.createReadStream(getFixturePath('malformed-data.md'))
      .pipe(parse())
      .on('frontmatter', function(data) {
        assert.deepEqual(undefined, data)
      })
      .on('error', function(error) {
        assert(error)
        done()
      })
      .on('end', function(content) {
        throw new Error('we should not have content here')
      })
  })

  it('throws errors on un-closed frontmatter', function(done) {
    var buffer = []
    fs.createReadStream(getFixturePath('malformed-unclosed.md'))
      .pipe(parse({debug: true}))
      .on('frontmatter', function(data) {
        assert.deepEqual(undefined, data)
      })
      .on('error', function(error) {
        assert(error)
        done()
      })
      .on('end', function(content) {
        throw new Error('we should not have content here')
      })
  })

})
