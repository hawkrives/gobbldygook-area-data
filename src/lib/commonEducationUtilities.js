import _ from 'lodash'

import onlyQuarterCreditCoursesCanBePassFail from 'sto-helpers/lib/onlyQuarterCreditCoursesCanBePassFail'
import hasFOL from 'sto-helpers/lib/hasFOL'
import hasGenEd from 'sto-helpers/lib/hasGenEd'
import countGeneds from 'sto-helpers/lib/countGeneds'
import getDepartments from 'sto-helpers/lib/getDepartments'
import acrossAtLeastTwoDepartments from 'sto-helpers/lib/acrossAtLeastTwoDepartments'
import checkThatCoursesSpanDepartmentsAndGeneds from 'sto-helpers/lib/checkThatCoursesSpanDepartmentsAndGeneds'
import isIntercollegiateSport from 'sto-helpers/lib/isIntercollegiateSport'

export {
	onlyQuarterCreditCoursesCanBePassFail,
	hasGenEd,
	hasFOL,
	countGeneds,
	getDepartments,
	acrossAtLeastTwoDepartments,
	checkThatCoursesSpanDepartmentsAndGeneds,
	isIntercollegiateSport
}
