import evaluate from '../lib/evaluate'

describe('evaluate', () => {
    it('evaluates!', () => {
        const area = {
            name: 'Sample Area',
            type: 'major',
            revision: '0000-01',
            result: {$type: 'reference', $requirement: 'Req'},
            Req: {
                $type: 'requirement',
                result: {
                    $type: 'course',
                    department: ['ASIAN'],
                    number: 0,
                },
            },
        }
        const courses = []
        const overrides = {}

        expect(() => evaluate({courses, overrides}, area)).not.to.throw()
    })
})
