it('returns an override', () => {
        expect(getOverride(['a', 'b', 'c'], {'a.b.c': true})).to.equal(true)
    })
    it('simply returns the value of the override', () => {
        expect(getOverride(['a', 'b', 'c'], {'a.b.c': false})).to.equal(false)

        const arr = [1, 2, 3]
        expect(getOverride(['a', 'b', 'c'], {'a.b.c': arr})).to.equal(arr)
    })
