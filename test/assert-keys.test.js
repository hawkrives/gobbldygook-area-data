import tape from 'tape'
import assertKeys from '../lib/assert-keys'
import {RequiredKeyError} from '../lib/errors'

tape.test('assertKeys', (t) => {
    t.throws(() => assertKeys({a: 1}, 'b'), RequiredKeyError, 'checks for required keys')
    t.doesNotThrow(() => assertKeys({a: 1}, 'a'), RequiredKeyError, 'is quiet if all keys are present')

    t.end()
})
