#!/usr/bin/env node

import evaluate from '../build/evaluate'
import fs from 'graceful-fs'
import commander from 'commander'
import {version} from '../package.json'

function loadFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8')
    return JSON.parse(data)
}

const arrow = ' > '
function summarizeItem(data, path=[]) {
    return map(data, value => {
        let reason = map(data, (val, key) => summarizeItem(val, path.concat([key]))).join('\n')
        if ('computed' in value && !value.computed) {
            if (value.$type === 'of') {
                reason = `${value.$has} of ${value.$count}`
            }
            let result = `Failed: ${path.join(arrow)} (${reason})`
            return result
        }
    })
}
import map from 'lodash/collection/map'

function summarize(data) {
    return data
}

function proseify(data) {
    return data
}

function cli() {
    commander
        .version(version)
        .usage('[options] areaFile studentFile')
        .option('--json', 'print json')
        .option('--prose', '')
        .option('--summary', '')
        .option('--status', '')
        .parse(process.argv)

    if (!process.argv.slice(2).length) {
        commander.outputHelp()
        return
    }

    // if we don't get both areaFile and studentFile
    if (commander.args.length !== 2) {
        commander.outputHelp()
        return
    }

    let [areaFile, studentFile] = commander.args
    const {courses, overrides} = loadFile(studentFile)
    const area = loadFile(areaFile)

    const result = evaluate({courses, overrides}, area)

    if (commander.json) {
        const string = JSON.stringify(result, null, 2)
        console.log(string)
    }
    else if (commander.prose) {
        console.log(proseify(result))
    }
    else if (!commander.status) {
        console.log(summarize(result))
    }

    if (!result.computed) {
        process.exit(1)
    }
}

cli()
