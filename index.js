const through = require('through2')
const yaml = require('js-yaml')
const MARKER = '---\n'

module.exports = function(options) {
  var buffer = ''
  return through(function(chunk, enc, next) {
    if (typeof buffer === 'string') {
      buffer += chunk.toString()
      if (buffer.indexOf(MARKER) === 0) {
        var lastIndex = buffer.lastIndexOf(MARKER)
        if (lastIndex > 0) {
          var frontmatter = buffer.substr(MARKER.length, lastIndex - MARKER.length)
          // console.warn('parsing:', JSON.stringify(frontmatter))
          frontmatter = yaml.safeLoad(frontmatter, options)
          this.emit('frontmatter', frontmatter)
          buffer = buffer.substr(lastIndex + MARKER.length)
          // console.warn('buffered:', JSON.stringify(buffer))
          return next(null, buffer)
        }
      }
    } else {
      return next(null, chunk)
    }
  })
}
