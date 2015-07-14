import tape from 'tape'
import hasOverride from '../lib/has-override'

tape.test('hasOverride', (t) => {
    t.true(hasOverride(['a', 'b', 'c'], {'a.b.c': true}), 'checks if an override exists')
    t.true(hasOverride(['a', 'b', 'c'], {'a.b.c': false}), 'doesn\'t just return the value of the override')

    t.end()
})
