import findOperatorType from '../lib/find-operator-type'

describe('findOperatorType', () => {
    it('returns the type of an operator', () => {
        expect(findOperatorType({$eq: 1})).to.equal('$eq')
    })
    it('throws if operator does not contain a valid type', () => {
        expect(() => findOperatorType({'$bad-op': 'stuff'})).to.throw(TypeError)
    })
})
