import reject from 'lodash/collection/reject'
import has from 'lodash/object/has'

/**
 * Throws a ReferenceError if any requested key is missing.
 * @private
 * @param {Object} dict - the object with keys to check
 * @param {...string} listOfKeys - the list of keys to look for
 * @throws {ReferenceError} Param 'dict' must include all requested keys
 * @returns {void}
 */
export default function assertKeys(dict, ...listOfKeys) {
    const missingKeys = reject(listOfKeys, key => has(dict, key))
    if (missingKeys.length) {
        throw new ReferenceError(`assertKeys(): missing ${missingKeys.join(', ')} from ${JSON.stringify(dict)}`)
    }
}
