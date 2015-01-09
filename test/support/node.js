var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

global.expect = chai.expect
chai.use(chaiAsPromised)

global.basicThenableStudent = {then() { return {courses: []} }}
