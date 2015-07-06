#!/usr/bin/env node

import yaml from 'js-yaml'
import {enhanceFile} from '../build/hanson'
import fs from 'graceful-fs'

function loadFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8')
    const object = yaml.safeLoad(data)
    return object
}

function writeFile(filename, data) {
    fs.writeFileSync(filename, data)
}

function cli() {
    const filename = process.argv[2]
    const outfile = process.argv[3] || filename.replace(/.yaml$/, '.json')
    if (!filename) {
        console.log(`usage: ${process.argv[1].split('/').slice(-1)} infile [outfile]`)
        return
    }
    const data = loadFile(filename)
    const mutated = enhanceFile(data, {topLevel: true})
    writeFile(outfile, JSON.stringify(mutated, null, 2))
}

cli()
