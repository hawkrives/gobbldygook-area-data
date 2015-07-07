import {parse} from '../lib/parse-hanson-string'
import forEach from 'lodash/collection/forEach'
import humanizeList from 'humanize-list'
import includes from 'lodash/collection/includes'
import isString from 'lodash/lang/isString'
import keys from 'lodash/object/keys'
import mapValues from 'lodash/object/mapValues'

function isReqName(name) {
    return /^([A-Z]|[0-9][A-Z0-9\- ])/.test(name)
}

let declaredVariables = {}

export function enhanceFile(data, {topLevel=false}={}) {
    // 1. adds 'result' key, if missing
    // 2. parses the 'result' and 'filter' keys
    // 3. warns if it encounters any lowercase keys not in the whitelist

    const baseWhitelist = ['result', 'message', 'declare']
    const topLevelWhitelist = baseWhitelist.concat(['name', 'revision', 'type'])
    const lowerLevelWhitelist = baseWhitelist.concat(['filter', 'message', 'description'])
    const whitelist = topLevel ? topLevelWhitelist : lowerLevelWhitelist

    keys(data).forEach(key => {
        if (!isReqName(key) && !includes(whitelist, key)) {
            console.warn(`only ${humanizeList(whitelist)} keys are allowed, and '${key}' is not one of them. all requirements must begin with an uppercase letter or a number.`)
        }
    })

    if ('declare' in data) {
        forEach(data.declare, (value, key) => {
            declaredVariables[key] = value
        })
    }

    const mutated = mapValues(data, (value, key) => {
        if (isString(value) && isReqName(key)) {
            value = {result: value}
        }

        if (isReqName(key)) {
            value = enhanceFile(value, {topLevel: false})
            value.$type = 'requirement'
        }

        else if (key === 'result' || key === 'filter') {
            forEach(declaredVariables, (contents, name) => {
                if (includes(value, '$' + name)) {
                    console.log(`replacing ${'$' + name} with ${contents}`)
                    // const rex = new RegExp(, 'g')
                    value = value.split(`$${name}`).join(contents)
                }
            })

            try {
                value = parse(value)
            }
            catch (e) {
                console.error(e.message)
                console.error(`(in '${value}')`)
            }
        }

        return value
    })

    if ('declare' in data) {
        forEach(data.declare, (value, key) => {
            delete declaredVariables[key]
        })
    }

    return mutated
}
