var peg = require('./peg.js')
var fs = require('fs')

function main() {
  if (process.argv.length < 3) {
    console.error('need a filename')
    return 0
  }
  var file = fs.readFileSync(process.argv[2], {encoding: 'utf-8'})

  console.info('parsing', file.trim())
  var parse = peg.parse(file)
  console.info('done parsing')

  console.log()
}

main()
