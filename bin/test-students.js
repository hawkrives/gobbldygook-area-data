import evaluate from '../src/evaluate'
import {enhanceFile} from '../src/hanson'
import pluralizeArea from '../lib/pluralize-area'
import kebabCase from 'lodash/string/kebabCase'

import {readFileSync, readdirSync} from 'graceful-fs'
import {safeLoad} from 'js-yaml'

import path from 'path'

const studentDir = './example-students/'

function loadArea({name, type/*, revision*/}) {
    const filepath = path.join('areas/', pluralizeArea(type), `${kebabCase(name)}.yaml`)
    return enhanceFile(safeLoad(readFileSync(filepath, {encoding: 'utf-8'})), {topLevel: true})
}

function loadStudent(filename) {
    return JSON.parse(readFileSync(filename, {encoding: 'utf-8'}))
}

function getStudentNames() {
    return readdirSync(studentDir)
        .filter((filename) => path.extname(filename) === '.json')
        .map((filename) => path.resolve(studentDir + filename))
}

export function cli() {
    getStudentNames()
        .map(filename => {
            const s = loadStudent(filename)
            s.areas = s.areas.map(loadArea)
            return {...s, filename}
        })
        .forEach(({courses, overrides, areas, filename, expectation=true}) => {
            describe(filename, () => {
                areas.forEach(data => {
                    it(`${expectation ? 'should' : 'should not'} pass ${data.name}`, () => {
                        const result = evaluate({courses, overrides}, data)
                        expect(result).to.have.property('computed', expectation)
                    })
                })
            })
        })
}
