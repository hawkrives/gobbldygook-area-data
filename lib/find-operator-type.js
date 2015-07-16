import has from 'lodash/object/has'

export default function findOperatorType(operator) {
    if (has(operator, '$eq')) {
        return '$eq'
    }
    else if (has(operator, '$ne')) {
        return '$ne'
    }
    else if (has(operator, '$lt')) {
        return '$lt'
    }
    else if (has(operator, '$lte')) {
        return '$lte'
    }
    else if (has(operator, '$gt')) {
        return '$gt'
    }
    else if (has(operator, '$gte')) {
        return '$gte'
    }
    else {
        throw new TypeError('findOperatorType(): no valid operators ($eq, $ne, $lt, $lte, $gt, $gte) could be found')
    }
}
