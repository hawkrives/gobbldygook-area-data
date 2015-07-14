import tape from 'tape'
import isRequirementName from '../lib/is-requirement-name'

tape('isRequirementName checks if a string is a requirement name', (t) => {
    t.true(isRequirementName('BTS-B'), 'can contain hyphens')
    t.true(isRequirementName('BTS-B'), 'may be a single letter')
    t.true(isRequirementName('0'), 'may be a single number')
    t.true(isRequirementName('Studio Art'), 'may include spaces')
    t.false(isRequirementName('_A0'), 'mustn\'t begin with an underscore')

    t.end()
})
