# front-matter-stream
Stream a file and capture [YAML front matter] separately from content:

```js
const fs = require('fs')
const fm = require('front-matter-stream')

fs.createReadStream('some-file.md')
  .pipe(fm())
  .on('frontmatter', function(data) {
    // handle your data here
  })
  .on('data', function() {
    // write or buffer your data here
  })
  // or write just the content to another file
  .pipe(fs.createWriteStream('some-other-file.md'))
```

## Installation
```
npm install --save front-matter-stream
```

[YAML front matter]: https://jekyllrb.com/docs/frontmatter/
