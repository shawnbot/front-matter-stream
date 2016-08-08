const through = require('through2')
const yaml = require('js-yaml')
const MARKER = '---\n'

module.exports = function(options) {
  var buffer = ''
  var log = (options && options.debug === true)
    ? function() { console.warn.apply(console, arguments) }
    : function() { }

  return through(function read(chunk, enc, next) {
    if (typeof buffer === 'string') {
      buffer += chunk.toString()
      var tmp

      if (buffer.indexOf(MARKER) === 0) {

        var lastIndex = buffer.lastIndexOf(MARKER)
        if (lastIndex > 0) {
          var frontmatter = buffer.substr(MARKER.length, lastIndex - MARKER.length)
          try {
            frontmatter = yaml.safeLoad(frontmatter, options)
          } catch (error) {
            return this.emit('error', error), next()
          }
          this.emit('frontmatter', frontmatter)
          buffer = buffer.substr(lastIndex + MARKER.length)
          return next(null, buffer), (buffer = null)
        } else {
          // log('buffering:', JSON.stringify(buffer))
          return next()
        }

      } else if (buffer.length > MARKER.length) {
        return next(null, buffer), (buffer = null)
      }
    }
    return next(null, chunk)
  }, function end(done) {
    if (typeof buffer === 'string') {
      var error = new Error('Unclosed front matter')
      error.buffer = buffer
      this.emit('error', error)
    }
    done()
  })
}
