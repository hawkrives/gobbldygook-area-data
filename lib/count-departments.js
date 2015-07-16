import compact from 'lodash/array/compact'
import getDepartments from './get-departments'

export default function countDepartments(courses) {
    return compact(getDepartments(courses)).length
}
