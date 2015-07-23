import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

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
        $and: PropTypes.array,
        $key: PropTypes.string,
        $or: PropTypes.array,
        $type: PropTypes.oneOf(['qualification', 'boolean']).isRequired,
        $value: PropTypes.object,
    }

    render() {
        return (this.props.$type === 'qualification')
            ? <Qualification {...this.props} />
            : <BooleanGroup {...this.props} />
    }
}

class BooleanGroup extends Component {
    render() {
        return <span>{JSON.stringify(this.props)}</span>
    }
}

class Qualification extends Component {
    static propTypes = {
        $key: PropTypes.string.isRequired,
        $operator: PropTypes.oneOf(['$eq', '$ne', '$lt', '$lte', '$gt', '$gte']).isRequired,
        $type: PropTypes.oneOf(['qualification']).isRequired,
        $value: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
    }

    render() {
        console.log(this.props)
        return (
            <span>
                {'{'}
                {this.props.$key}
                {humanizeOperator(this.props.$operator)}
                {this.props.$value}
                {'}'}
            </span>)
    }
}

export default class Where extends Component {
    static propTypes = {
        $count: PropTypes.number.isRequired,
        $type: PropTypes.oneOf(['where']).isRequired,
        $where: PropTypes.shape({
            $type: PropTypes.oneOf(['qualification', 'boolean']).isRequired,
            $key: PropTypes.string.isRequired,
            $value: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
            $operator: PropTypes.oneOf(['$eq', '$ne', '$lt', '$lte', '$gt', '$gte']).isRequired,
        }),
        _counted: PropTypes.number,
        _matches: PropTypes.arrayOf(PropTypes.object),
        _result: PropTypes.bool,
        style: PropTypes.object,
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
                {has} of {wants} courses from courses where <Qualifier {...filter} />
            </span>
        )
    }
}
