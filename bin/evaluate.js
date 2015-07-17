import evaluate from '../lib/evaluate'
import meow from 'meow'
import pkg from '../package.json'
import fs from 'graceful-fs'
import kebabCase from 'lodash/string/kebabCase'
import yaml from 'js-yaml'
import enhanceHanson from '../lib/enhance-hanson'
import pluralizeArea from '../lib/pluralize-area'
import path from 'path'

function loadArea({name, type/*, revision*/}) {
    const filepath = path.join('areas/', pluralizeArea(type), `${kebabCase(name)}.yaml`)
    const data = fs.readFileSync(filepath, {encoding: 'utf-8'})
    const obj = yaml.safeLoad(data)
    return enhanceHanson(obj, {topLevel: true})
}

const checkAgainstArea = ({courses, overrides}, args) => (areaData) => {
    const result = evaluate({courses, overrides}, areaData)

    if (args.json) {
        console.log(JSON.stringify(result, null, 2))
    }
    else if (args.prose) {
        console.log('not implemented')
        // console.log(proseify(result))
    }
    else if (args.summary) {
        console.log('not implemented')
        // console.log(summarize(result))
    }

    if (!result.computed) {
        process.exit(1)
    }
}

function run({courses, overrides, areas}, args) {
    areas.map(loadArea)
         .forEach(checkAgainstArea({courses, overrides}, args))
}

export function cli() {
    const args = meow({
        pkg,
        help: `Usage:
            evaluate [--json] [--prose] [--summary] [--status] studentFile`,
    })

    let [filename] = args.input

    if (!meow.json && !meow.prose && !meow.summary && !meow.status) {
        meow.showHelp()
        return
    }

    if (filename) {
        run(JSON.parse(fs.readFileSync(filename, 'utf-8')), args.flags)
    }

    meow.showHelp()
}
