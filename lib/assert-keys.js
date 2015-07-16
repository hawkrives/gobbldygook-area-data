import reject from 'lodash/collection/reject'
import has from 'lodash/object/has'

export default function assertKeys(dict, ...listOfKeys) {
    const missingKeys = reject(listOfKeys, key => has(dict, key))
    if (missingKeys.length) {
        throw new ReferenceError(`assertKeys(): missing ${missingKeys.join(', ')} from ${JSON.stringify(dict)}`)
    }
}
