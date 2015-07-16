import fs from 'graceful-fs'
import evaluate from '../lib/evaluate'

import kebabCase from 'lodash/string/kebabCase'
import yaml from 'js-yaml'
import enhanceHanson from '../lib/enhance-hanson'
import pluralizeArea from '../lib/pluralize-area'
import {join} from 'path'
import * as _ from 'lodash'
import sparkly from 'sparkly'

function loadArea({name, type/*, revision*/}) {
    const path = join('./', 'areas/', pluralizeArea(type), `${kebabCase(name)}.yaml`)
    return enhanceHanson(yaml.safeLoad(fs.readFileSync(path, 'utf-8')), {topLevel: true})
}

function now(other=[]) {
    let time = process.hrtime(other)
    return time[0] * 1e3 + time[1] / 1e6
}

const n = _.range(100)

const dir = './example-students/'
fs.readdirSync(dir)
    .filter(name => !_.includes(name, '.ip'))
    .map(path => dir + path)
    .map(path => fs.readFileSync(path, 'utf-8'))
    .map(JSON.parse)
    .forEach(({courses=[], overrides={}, areas=[]}) => {
        areas.forEach(areaInfo => {
            console.log(`processing ${areaInfo.name}:`)
            let areaData = loadArea(areaInfo)
            let times = []
            n.forEach(() => {
                const start = process.hrtime()
                evaluate({courses, overrides}, areaData)
                times.push(now(start))
            })
            console.log(`  ${sparkly(times)}`)
            console.log()
            console.log(`  average time: ${_.sum(times) / _.size(times)}`)
            console.log()
        })
    })
