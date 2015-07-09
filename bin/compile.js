import commander from 'commander'
import Promise from 'bluebird'
import {version} from '../package.json'
import stdinCb from 'get-stdin'
const stdin = Promise.promisify(stdinCb)
import fs from 'graceful-fs'
const readFile = Promise.promisify(fs.readFile)

import yaml from 'js-yaml'
import {enhanceFile} from '../src/hanson'

function run(data) {
    const mutated = enhanceFile(yaml.safeLoad(data), {topLevel: true})
    console.log(JSON.stringify(mutated, null, 2))
}

function cli() {
    commander
        .version(version)
        .usage('areaFile | - (read from stdin)')
        .parse(process.argv)

    let [filename] = process.argv.slice(2)

    if (filename === '-') {
        stdin().then(run)
    }
    else if (filename) {
        readFile(filename, 'utf-8').then(run)
    }
    else {
        commander.outputHelp()
        return
    }
}

cli()
