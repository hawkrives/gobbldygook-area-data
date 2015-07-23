import React, {Component, PropTypes} from 'react'

import CourseExpression from './expression-course'

import cx from 'classnames'
import './expression.less'

const joiners = {
    $and: 'AND',
    $or: 'OR',
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
        let description = null

        if ($type === 'boolean') {
            let kind = '$invalid'

            if (expr.hasOwnProperty('$and')) {
                kind = '$and'
            }
            else if (expr.hasOwnProperty('$or')) {
                kind = '$or'
            }

            contents = expr[kind].reduce((acc, exp, i) => {
                if (i > 0) {
                    acc.push(<span key={`${i}-joiner`} className='joiner'>{joiners[kind]}</span>)
                }
                acc.push(<Expression key={i} expr={exp} ctx={this.props.ctx} />)
                return acc
            }, [])
        }
        else if ($type === 'course') {
            contents = <CourseExpression {...expr.$course} />
        }
        else if ($type === 'reference') {
            contents = expr.$requirement
        }
        else if ($type === 'of') {
            description = `${expr._counted || 0} of ${expr.$count}`
            contents = expr.$of.map((ex, i) =>
                <Expression key={i} expr={ex} ctx={this.props.ctx} />)
        }
        else if ($type === 'modifier') {
            description = `${wasComputed ? expr._counted + ' of ' : ''}${expr.$count} ${expr.$what + (expr.$count === 1 ? '' : 's')} from ${expr.$from}`
        }
        else if ($type === 'where') {
            description = JSON.stringify(expr)
        }
        else {
            contents = JSON.stringify(expr)
        }

        return (
            <span className={cx('expression', `expression--${$type}`, wasComputed ? 'computed' : 'computed--not', computationResult ? 'computed-success' : 'computed-failure')}>
                {description ? <div className='expression--description'>{description}</div> : null}
                {contents ? <span className='expression--contents'>{contents}</span> : null}
            </span>
        )
    }
}
