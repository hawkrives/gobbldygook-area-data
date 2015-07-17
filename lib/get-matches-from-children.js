import collectMatches from './collect-matches'
import filter from 'lodash/collection/filter'
import flatten from 'lodash/array/flatten'
import includes from 'lodash/collection/includes'
import isArray from 'lodash/lang/isArray'
import isRequirementName from './is-requirement-name'
import keys from 'lodash/object/keys'
import map from 'lodash/collection/map'
import pluck from 'lodash/collection/pluck'
import uniq from 'lodash/array/uniq'

export default function getMatchesFromChildren(expr, ctx) {
    // grab all the child requirement names for this req
    let childKeys = filter(keys(ctx), isRequirementName)

    // two options:
    if (expr.$children === '$all') {
        // use all of the child requirements in the computation
        childKeys = childKeys
    }
    else if (isArray(expr.$children)) {
        // or just use some of them (listed in expr.$children)
        const requested = pluck(expr.$children, '$requirement')
        childKeys = filter(childKeys, key => includes(requested, key))
    }

    // collect the matching courses from the requested children
    // TODO: uniq here suffers from the same problem that the dirty course stuff is
    //       struggling with. (that is, uniq works on a per-object basis, and while
    //       you can write down the same course for several reqs, they'll be different
    //       objects.)
    const matches = uniq(flatten(map(childKeys, key => collectMatches(ctx[key]))))

    return matches
}
