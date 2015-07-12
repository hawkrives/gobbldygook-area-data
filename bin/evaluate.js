import evaluate from '../src/evaluate'
import commander from 'commander'
import {version} from '../package.json'
import {readFileSync} from 'graceful-fs'
import kebabCase from 'lodash/string/kebabCase'
import yaml from 'js-yaml'
import {enhanceFile} from '../src/hanson'

function pluralizeArea(type) {
    type = type.toLowerCase()
    if (type === 'emphasis') {
        return 'emphases'
    }
    else {
        return type + 's'
    }
}

function loadArea({name, type, revision}) {
    const path = `./areas/${pluralizeArea(type)}/${kebabCase(name)}.yaml`
    return enhanceFile(yaml.safeLoad(readFileSync(path, 'utf-8')), {topLevel: true})
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
    else if (commander.summary) {
        console.log('not implemented')
        // console.log(summarize(result))
    }

    if (!result.computed) {
        process.exit(1)
    }
}

function run({courses, overrides, areas}) {
    areas.map(loadArea)
         .forEach(checkAgainstArea({courses, overrides}))
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

    if (!commander.json && !commander.prose && ~commander.summary && !commander.status) {
        commander.outputHelp()
        return
    }

    if (filename) {
        run(JSON.parse(readFileSync(filename, 'utf-8')))
    }
    else {
        commander.outputHelp()
        return
    }
}

cli()
