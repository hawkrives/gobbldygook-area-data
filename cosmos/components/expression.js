import React, {Component, PropTypes} from 'react'
import flatten from 'lodash/array/flatten'

import cx from 'classnames'
import './expression.less'

export class CourseExpression extends Component {
    static propTypes = {
        _result: PropTypes.bool,
        department: PropTypes.arrayOf(PropTypes.string).isRequired,
        international: PropTypes.bool,
        lab: PropTypes.bool,
        number: PropTypes.number.isRequired,
        section: PropTypes.string,
        semester: PropTypes.number,
        style: PropTypes.object,
        year: PropTypes.number,
    }

    render() {
        const department = this.props.department.join('/')

        const international = this.props.international
            ? <span className='international'>I</span>
            : null
        const lab = this.props.lab
            ? <span className='lab'>L</span>
            : null

        const section = this.props.section
            ? <span className='section'>.{this.props.section}</span>
            : null

        const year = this.props.year
            ? <span className='year'>{this.props.year}</span>
            : null
        const semester = this.props.semester
            ? <span className='semester'>{this.props.semester}</span>
            : null

        /////

        const temporalIdentifiers = (semester || year)
            ? (<div className='temporal'>
                <span>S{semester}</span>
                <span>{year}</span>
            </div>)
            : null

        return (
            <span className={cx('course', {matched: this.props._result})} style={this.props.style}>
                <div className='basic-identifiers'>
                    <span className='department'>{department}</span>
                    <span>
                        <span className='number'>{this.props.number}</span>
                        {international}
                        {lab}
                        {' '}{section}
                    </span>
                </div>
                {temporalIdentifiers}
            </span>
        )
    }
}


export default class Expression extends Component {
    static propTypes = {
        ctx: PropTypes.object,
        expr: PropTypes.shape({
            $type: PropTypes.string,
        }).isRequired,
    }

    render() {
        const {expr} = this.props
        const {$type} = expr

        const wasComputed = expr.hasOwnProperty('_result')
        const computationResult = expr._result

        let contents = null

        const joiners = {
            $and: 'AND',
            $or: 'OR',
        }

        if ($type === 'boolean') {
            let kind = '$invalid'
            if (expr.hasOwnProperty('$and')) {
                kind = '$and'
            }
            else if (expr.hasOwnProperty('$or')) {
                kind = '$or'
            }
            const joiner = joiners[kind]
            const end = expr[kind].length - 1
            contents = flatten(expr[kind].map((ex, i) => [
                <Expression key={i} expr={ex} ctx={this.props.ctx} />,
                i < end ? <span key={`${i}-joiner`} className='joiner'>{joiner}</span> : null,
            ]))
        }
        else if ($type === 'course') {
            contents = <CourseExpression {...expr.$course} />
        }
        else if ($type === 'reference') {
            contents = expr.$requirement
        }
        else if ($type === 'of') {
            contents = (
                <span>
                    <div>
                        {wasComputed ? expr._counted + ' of ' : ''}
                        {expr.$count} needed from {' '}
                    </div>
                    {expr.$of.map((ex, i) =>
                        <Expression key={i} expr={ex} ctx={this.props.ctx} />)}
                </span>
            )
        }
        else if ($type === 'modifier') {
            contents = `${wasComputed ? expr._counted + ' of ' : ''}${expr.$count} ${expr.$what + (expr.$count === 1 ? '' : 's')} from ${expr.$from}`
        }
        else {
            contents = <span>{JSON.stringify(expr)}</span>
        }

        return (
            <span className={cx('expression', `expression--${$type}`, {computed: wasComputed}, {'computed-success': computationResult}, {'computed-failure': !computationResult})}>
                {contents}
            </span>
        )
    }
}
