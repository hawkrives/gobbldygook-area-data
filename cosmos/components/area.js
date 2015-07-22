import BooleanExpression from './expression-boolean'
import ModifierExpression from './expression-modifier'
import CourseExpression from './expression-course'
import OccurrenceExpression from './expression-occurrence'
import OfExpression from './expression-of'
import ReferenceExpression from './expression-reference'
import WhereExpression from './expression-where'
// import Expression from './expression'

import React, {Component, PropTypes} from 'react'
import styles from './area.less'

// import TreeView from 'react-treeview'
// import 'react-treeview/react-treeview.css'

import map from 'lodash/collection/map'
import flatten from 'lodash/array/flatten';
import filter from 'lodash/collection/filter'
import keys from 'lodash/object/keys'
import isRequirementName from '../../lib/is-requirement-name'

const good = <span style={{color: '#3D9970'}}>✓</span>
const bad = <span style={{color: '#FF4136', fontWeight: 'bold'}}>×</span>

class Expression extends Component {
    static propTypes = {
        expr: PropTypes.shape({
            $type: PropTypes.string,
        }).isRequired,
        ctx: PropTypes.object,
    }

    render() {
        const {expr} = this.props
        const {$type} = expr

        const wasComputed = expr.hasOwnProperty('_result')
        const computationResult = expr._result

        let contents = <span>{JSON.stringify(expr)}</span>

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

        return (
            <span className={`expression expression--${$type} ${wasComputed ? computationResult ? 'computed-success' : 'computed-failure' : 'computed-not'}`}>
                {contents}
            </span>
        )
    }
}

class Requirement extends Component {
    static propTypes = {
        filter: PropTypes.object,
        message: PropTypes.string,
        result: PropTypes.object,
        computed: PropTypes.bool,
        name: PropTypes.string,
    }

    render() {
        const childKeys = filter(keys(this.props), isRequirementName)

        const result = this.props.result
            ? <div><Expression expr={this.props.result || {}} ctx={this.props} /></div>
            : null

        const message = this.props.message
            ? <p>{this.props.message}</p>
            : null

        const filterEl = this.props.filter
            ? <div>Filter: {this.props.filter}</div>
            : null

        const wasComputed = this.props.hasOwnProperty('computed')
        const computationResult = this.props.computed

        let computed = wasComputed
                ? computationResult ? good : bad
                : ''

        return (
            <div className={`requirement`}>
                <h2 className={`${wasComputed ? computationResult ? 'computed-success' : 'computed-failure' : 'computed-not'}`}>{this.props.name}</h2>
                {message}
                {filterEl}
                {result}
                {childKeys.map(k => <Requirement key={k} name={k} {...this.props[k]} />)}
            </div>
        )
    }
}

export default class AreaOfStudy extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        revision: PropTypes.string.isRequired,
        result: PropTypes.object.isRequired,
    }

    static defaultProps = {
        name: 'Unknown Area',
        type: '???',
        revision: '0000-00',
        result: {},
    }

    render() {
        return (
            <div className='area'>
                <h1>{this.props.name}</h1>
                <Requirement {...this.props} />
            </div>
        )
    }
}
