import tape from 'tape'
import pathToOverride from '../lib/path-to-override'

tape.test('pathToOverride', (t) => {
    t.equal(pathToOverride(['a', 'b', 'c d']), 'a.b.c d', 'computes the path to an override')
    t.equal(pathToOverride(['aA', 'b', 'c d']), 'aa.b.c d', 'lower-cases the path')
    t.equal(pathToOverride(['aA', 'b', 'Studio aRt']), 'aa.b.studio art', 'retains spaces in the path')

    t.end()
})
