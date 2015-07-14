import tape from 'tape'
import getOverride from '../lib/get-override'

tape.test('getOverride', (t) => {
    t.equal(getOverride(['a', 'b', 'c'], {'a.b.c': true}), true, 'returns an override')
    t.equal(getOverride(['a', 'b', 'c'], {'a.b.c': false}), false, 'simply returns the value of the override')

    const arr = [1, 2, 3]
    t.equal(getOverride(['a', 'b', 'c'], {'a.b.c': arr}), arr, 'returns the same instance, too')

    t.end()
})
