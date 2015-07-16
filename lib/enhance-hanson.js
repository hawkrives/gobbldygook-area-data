import {parse} from '../lib/parse-hanson-string'
import cloneDeep from 'lodash/lang/cloneDeep'
import filter from 'lodash/collection/filter'
import forEach from 'lodash/collection/forEach'
import humanizeList from 'humanize-list'
import includes from 'lodash/collection/includes'
import isRequirementName from './isRequirementName'
import isString from 'lodash/lang/isString'
import keys from 'lodash/object/keys'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import zipObject from 'lodash/array/zipObject'

let declaredVariables = {}

export default function enhanceFile(data, {topLevel=false}={}) {
    // 1. adds 'result' key, if missing
    // 2. parses the 'result' and 'filter' keys
    // 3. warns if it encounters any lowercase keys not in the whitelist

    const baseWhitelist = ['result', 'message', 'declare']
    const topLevelWhitelist = baseWhitelist.concat(['name', 'revision', 'type'])
    const lowerLevelWhitelist = baseWhitelist.concat(['filter', 'message', 'description'])
    const whitelist = topLevel ? topLevelWhitelist : lowerLevelWhitelist

    forEach(keys(data), key => {
        if (!isRequirementName(key) && !includes(whitelist, key)) {
            console.warn(`only ${humanizeList(whitelist)} keys are allowed, and '${key}' is not one of them. all requirements must begin with an uppercase letter or a number.`)
        }
    })

    const requirements = filter(keys(data), isRequirementName)
    const abbreviations = zipObject(map(requirements,
        req => [req.replace(/.* \(([A-Z\-]+)\)$|.*$/, '$1'), req]))
    const titles = zipObject(map(requirements,
        req => [req.replace(/(.*) \([A-Z\-]+\)$|.*$/, '$1'), req]))

    const oldVariables = cloneDeep(declaredVariables)
    declaredVariables = {}

    forEach(data.declare || [], (value, key) => {
        declaredVariables[key] = value
    })

    const mutated = mapValues(data, (value, key) => {
        if (isString(value) && isRequirementName(key)) {
            value = {result: value}
        }

        if (isRequirementName(key)) {
            value = enhanceFile(value, {topLevel: false})
            value.$type = 'requirement'
        }

        else if (key === 'result' || key === 'filter') {
            forEach(declaredVariables, (contents, name) => {
                if (includes(value, '$' + name)) {
                    console.log(`replacing ${'$' + name} with ${contents}`)
                    value = value.split(`$${name}`).join(contents)
                }
            })

            try {
                value = parse(value, {abbreviations, titles})
            }
            catch (e) {
                console.error(e.message)
                console.error(`(in '${value}')`)
            }
        }

        return value
    })

    forEach(data.declare || [], (value, key) => {
        delete declaredVariables[key]
    })
    declaredVariables = oldVariables

    return mutated
}