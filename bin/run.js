import evaluate from '../build/evaluate'
import fs from 'graceful-fs'
import commander from 'commander'
import {version} from '../package.json'
import {enhanceFile} from '../build/hanson'
import yaml from 'js-yaml'

function loadFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8')
    return data
}

function loadJson(filename) {
    return JSON.parse(loadFile(filename))
}

function loadYaml(filename) {
    return yaml.safeLoad(loadFile(filename))
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
    const {courses, overrides} = loadJson(studentFile)
    const rawArea = loadYaml(areaFile)
    const area = enhanceFile(rawArea, {topLevel: true})

    const result = evaluate({courses, overrides}, area)

    if (commander.json) {
        const string = JSON.stringify(result, null, 2)
        console.log(string)
    }
    if (!result.computed) {
        process.exit(1)
    }
}

cli()
