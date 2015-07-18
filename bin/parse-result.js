import {parse} from '../lib/parse-hanson-string'
import meow from 'meow'
import pkg from '../package.json'

export function cli() {
    const args = meow({
        pkg,
        help: `Usage:
            parse-result [--js] 'result expression'`,
    })

    const data = args.input[0] || args.flags.js

    if (!data) {
        args.showHelp()
        return
    }

    const string = JSON.stringify(parse(data), null, 2)
    if (args.flags.js) {
        console.log(string.replace(/"/g, `'`).replace(/'(.*?)'(:.*)/g, '$1$2'))
    }
    else {
        console.log(string)
    }
}
