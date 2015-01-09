// sto-areas/test/lib-countGeneds.test.js
import findAreaOfStudy from '../index'

describe('findAreaOfStudy', () => {
	it('finds an area of study from an id', () => {
		let id = 'm-csci'
		let year = 2014

		expect(findAreaOfStudy(id, year)).to.be.ok
	})

	it('uses on the yearOfMatriculation parameter to find them within a span of years', () => {
		let id = 'm-csci'
		let year = 2014

		expect(findAreaOfStudy(id, year)).to.be.ok
	})

	it('doesn\'t return areas outside of the time range', () => {
		let id = 'm-csci'
		let year = 2013

		expect(findAreaOfStudy(id, year).type).to.equal('not-found')
	})
})
