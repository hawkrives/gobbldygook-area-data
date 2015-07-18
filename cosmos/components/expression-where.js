import React, {Component, PropTypes} from 'react'
import styles from './expression-where.less'
import cx from 'classnames'
import findOperatorType from '../../lib/find-operator-type'

function humanizeOperator(operator) {
    if (operator === '$eq') {
        return '='
    }
    else if (operator === '$ne') {
        return '!='
    }
    else if (operator === '$lt') {
        return '<'
    }
    else if (operator === '$lte') {
        return '<='
    }
    else if (operator === '$gt') {
        return '>'
    }
    else if (operator === '$gte') {
        return '>='
    }
    else {
        throw new TypeError(`humanizeOperator(): "${operator}" is not a valid operator`)
    }
}

class Qualifier extends Component {
    static propTypes = {
        $type: PropTypes.oneOf(['qualification', 'boolean']).isRequired,
        $key: PropTypes.string,
        $value: PropTypes.object,
        $or: PropTypes.array,
        $and: PropTypes.array,
    }

    render() {
        return (this.props.$type === 'qualification')
            ? <Qualification {...this.props} />
            : <BooleanGroup {...this.props} />
    }
}

class BooleanGroup extends Component {

}

class Qualification extends Component {
    static propTypes = {
        $type: PropTypes.oneOf(['qualification']).isRequired,
        $key: PropTypes.string.isRequired,
        $value: PropTypes.object.isRequired,
    }

    render() {
        const type = findOperatorType(this.props.$value)
        const operator = humanizeOperator(type)
        const value = this.props.$value[type]

        return (<span>{'{'}{this.props.$key} {operator} {value}{'}'}</span>)
    }
}

export default class Where extends Component {
    static propTypes = {
        style: PropTypes.object,
        _result: PropTypes.bool,
        _counted: PropTypes.number,
        _matches: PropTypes.arrayOf(PropTypes.object),
        $type: PropTypes.oneOf(['where']).isRequired,
        $count: PropTypes.number.isRequired,
        $where: PropTypes.shape({
            $type: PropTypes.oneOf(['qualification']).isRequired,
            $key: PropTypes.string.isRequired,
            $value: PropTypes.object.isRequired,
        }),
    }

    static defaultProps = {
        _counted: 0,
        _matches: [],
        _result: false,
    }

    render() {
        const wants = this.props.$count
        const has = this.props._counted

        const matches = this.props._matches

        const filter = this.props.$where

        return (
            <span className={cx('where', {matched: this.props._result})}
                  style={this.props.style}>
                {has} of {wants} courses from courses where <Qualification {...filter} />
            </span>
        )
    }
}
