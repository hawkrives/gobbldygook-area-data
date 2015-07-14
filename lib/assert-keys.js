import reject from 'lodash/collection/reject'
import has from 'lodash/object/has'
import {RequiredKeyError} from './errors'

export default function assertKeys(dict, ...listOfKeys) {
    const missingKeys = reject(listOfKeys, key => has(dict, key))
    if (missingKeys.length) {
        throw new RequiredKeyError(`missing ${missingKeys.join(', ')} from ${dict}`)
    }
}
