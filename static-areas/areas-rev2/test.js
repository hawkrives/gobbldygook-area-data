import check from './chem-test'
import loads from './chemGrads'

for (let l of loads) {
	console.log(l.name)
	console.log(check(l.load))
	console.log()
}
