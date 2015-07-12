import evaluate from '../src/evaluate'
import commander from 'commander'
import {version} from '../package.json'
import stdinCb from 'get-stdin'
const stdin = Promise.promisify(stdinCb)
import fs from 'graceful-fs'
const readFile = Promise.promisify(fs.readFile)
import map from 'lodash/collection/map'
import kebabCase from 'lodash/string/kebabCase'

function loadFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8')
    return JSON.parse(data)
}

function loadArea({title, type}) {
    const path = `../areas/${type}/${kebabCase(title).yaml}`
    return loadFile(path)
}

const checkAgainstArea = ({courses, overrides}) => (areaData) => {
    const result = evaluate({courses, overrides}, areaData)
    if (commander.json) {
        console.log(JSON.stringify(result, null, 2))
    }
    else if (commander.prose) {
        console.log('not implemented')
        // console.log(proseify(result))
    }
    else if (!commander.status) {
        console.log('not implemented')
        // console.log(summarize(result))
    }

    if (!result.computed) {
        process.exit(1)
    }
}

function run({courses, overrides, areas}) {
    map(areas, loadArea).forEach(checkAgainstArea({courses, overrides}))
}

function cli() {
    commander
        .version(version)
        .usage('[options] studentFile')
        .option('--json', 'print json')
        .option('--prose', '')
        .option('--summary', '')
        .option('--status', '')
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
