import commander from 'commander'
import {version} from '../package.json'
import {readFileSync} from 'graceful-fs'
import yaml from 'js-yaml'
import enhanceHanson from '../lib/enhance-hanson'

function cli() {
    commander
        .version(version)
        .usage('areaFile')
        .parse(process.argv)

    let [filename] = process.argv.slice(2)

    if (filename) {
        const mutated = enhanceHanson(yaml.safeLoad(readFileSync(filename, 'utf-8')), {topLevel: true})
        console.log(JSON.stringify(mutated, null, 2))
    }
    else {
        commander.outputHelp()
        return
    }
}

cli()
