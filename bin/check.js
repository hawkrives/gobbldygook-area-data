#!/usr/bin/env node

import {evaluate} from '../build/evaluate'
import fs from 'graceful-fs'

function loadFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8')
    return JSON.parse(data)
}

function cli() {
    if (process.argv.length < 3) {
        console.log('usage: evaluate areaFile [student]')
        return
    }

    let areaFile, studentFile
    if (process.argv.length >= 3) {
        areaFile = process.argv[2]
        studentFile = process.argv[3] || './student.json'
    }

    const {courses, overrides} = loadFile(studentFile)

    const result = evaluate({courses, overrides}, loadFile(areaFile))

    console.log(JSON.stringify(result, null, 2))
    console.log('outcome:', result.computed)
}

cli()
