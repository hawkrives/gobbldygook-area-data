import sum from 'lodash/math/sum'
import pluck from 'lodash/collection/pluck'

export default function countCredits(courses) {
    return sum(pluck(courses, 'credits'))
}
