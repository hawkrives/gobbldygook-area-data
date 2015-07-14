import tape from 'tape'
import evaluate from '../lib/evaluate'

tape.test('evaluate', (t) => {
    const area = {
        name: 'Sample Area',
        type: 'major',
        result: 'Requirement',
    }
    const courses = [{}]
    const overrides = {}

    t.true(evaluate({courses, overrides}, area), 'evaluates!')

    t.end()
})
