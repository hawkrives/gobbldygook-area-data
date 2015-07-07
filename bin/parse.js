#!/usr/bin/env node

import {parse} from '../lib/parse-hanson-string'

function cli() {
    if (process.argv.length < 3) {
        console.log('usage: parse-single "string"')
        return
    }

    console.log(JSON.stringify(parse(process.argv[2]), null, 2))
}

cli()
