import evaluate from '../src/evaluate'
import {enhanceFile} from '../src/hanson'
import pluralizeArea from '../lib/pluralize-area'
import kebabCase from 'lodash/string/kebabCase'

import {readFileSync, readdirSync} from 'graceful-fs'
import {safeLoad} from 'js-yaml'

import {join, resolve as resolvePath, extname} from 'path'

const studentDir = './example-students/'

function loadArea({name, type/*, revision*/}) {
    const path = join('./', 'areas/', pluralizeArea(type), `${kebabCase(name)}.yaml`)
    return enhanceFile(safeLoad(readFileSync(path, 'utf-8')), {topLevel: true})
}

function loadStudent(filename) {
    return JSON.parse(readFileSync(filename, 'utf-8'))
}

function getStudentNames() {
    return readdirSync(studentDir)
        .filter((filename) => extname(filename) === '.json')
        .map((filename) => resolvePath(studentDir + filename))
}

function main() {
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

main()
