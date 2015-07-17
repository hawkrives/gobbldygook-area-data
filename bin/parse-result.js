import {parse} from '../lib/parse-hanson-string'

export function cli() {
    if (process.argv.length < 3) {
        console.log('usage: parse-result "string"')
        return
    }

    console.log(JSON.stringify(parse(process.argv[2]), null, 2))
}
