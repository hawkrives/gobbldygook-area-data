import evaluate from '../lib/evaluate'

describe('evaluate', () => {
    it('evaluates!', () => {
        const area = {
            name: 'Sample Area',
            type: 'major',
            revision: '0000-01',
            result: '',
        }
        const courses = [{}]
        const overrides = {}

        expect(() => evaluate({courses, overrides}, area)).not.to.throw()
    })
})
