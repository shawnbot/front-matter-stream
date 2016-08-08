# front-matter-stream
Stream a file and capture [YAML front matter] separately from content:

```js
const fs = require('fs')
const fm = require('front-matter-stream')

var stream = fs.createReadStream('some-file.md')
  .pipe(fm())
  .on('frontmatter', function(data) {
    // handle your data here
  })
  .on('data', function() {
    // write or buffer your data here
  })

// or pipe just the content to another stream
stream.pipe(fs.createWriteStream('some-other-file.md'))

// or use concat-stream to collect the rest of the data
const concat = require('concat-stream')
stream.pipe(concat(function(content) {
  // content is Buffer here
}))
```

## Installation
```
npm install --save front-matter-stream
```

[YAML front matter]: https://jekyllrb.com/docs/frontmatter/
