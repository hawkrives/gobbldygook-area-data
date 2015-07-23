import React, {Component, PropTypes} from 'react'
import flatten from 'lodash/array/flatten'

import CourseExpression from './expression-course'

import cx from 'classnames'
import './expression.less'

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
