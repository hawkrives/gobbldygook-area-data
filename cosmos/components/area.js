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
import filter from 'lodash/collection/filter'
import keys from 'lodash/object/keys'
import isRequirementName from '../../lib/is-requirement-name'

const good = <span style={{color: '#3D9970'}}>✓</span>
const bad = <span style={{color: '#FF4136', fontWeight: 'bold'}}>×</span>
// const good = '✅'
// const bad = '❌'

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

        if ($type === 'boolean') {
            let kind = '$invalid'
            if (expr.hasOwnProperty('$and')) {
                kind = '$and'
            }
            else if (expr.hasOwnProperty('$or')) {
                kind = '$or'
            }
            contents = (
                <span>
                    {expr[kind].map((ex, i, coll) =>
                        <span key={i}>
                            <Expression expr={ex} ctx={this.props.ctx} />
                            {i < coll.length - 1 ? kind === '$or' ? ' || ' : ' && ' : ''}
                        </span>)}
                </span>
            )
        }
        else if ($type === 'course') {
            contents = <span>{expr.$course.department.join('/')} {expr.$course.number}</span>
        }
        else if ($type === 'reference') {
            contents = <span>^{expr.$requirement}</span>
        }
        else if ($type === 'of') {
            contents = (
                <span>{wasComputed ? expr._counted + ' of ' : ''}{expr.$count} needed from
                    ( {expr.$of.map((ex, i, coll) =>
                        <span key={i}>
                            <Expression expr={ex} ctx={this.props.ctx} />
                            {i < coll.length - 1 ? ', ' : ''}
                        </span>)} )
                </span>
            )
        }
        else if ($type === 'modifier') {
            contents = <span>{wasComputed ? expr._counted + ' of ' : ''}{expr.$count} {expr.$what + (expr.$count === 1 ? '' : 's')} from {expr.$from}</span>
        }

        let computed = wasComputed
                ? computationResult ? good : bad
                : ''

        return <span>({computed} {contents})</span>
    }
}

class Requirement extends Component {
    static propTypes = {
        filter: PropTypes.object,
        message: PropTypes.string,
        result: PropTypes.object,
        computed: PropTypes.boolean,
        name: PropTypes.string,
    }

    render() {
        const childKeys = filter(keys(this.props), isRequirementName)

        const result = this.props.result
            ? <li>Result: <Expression expr={this.props.result || {}} ctx={this.props} /></li>
            : ''

        const message = this.props.message
            ? <li>Message: "{this.props.message}"</li>
            : ''

        const filterEl = this.props.filter
            ? <li>Filter: {this.props.filter}</li>
            : ''

        const wasComputed = this.props.hasOwnProperty('computed')
        const computationResult = this.props.computed

        let computed = wasComputed
                ? computationResult ? good : bad
                : ''

        return (
            <li><strong>{this.props.name}</strong>: {computed}
                <ul>
                    {message}
                    {childKeys.map(k => <Requirement key={k} name={k} {...this.props[k]} />)}
                    {filterEl}
                    {result}
                </ul>
            </li>
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

    constructor(props) {
        super(props)
        this.state = {
            isCollapsed: false,
        }
    }

    toggle() {
        this.setState(newState => {
            newState.isCollapsed = !newState.isCollapsed
        })
    }

    render() {
        return (
            // <TreeView collapsed={this.state.isCollapsed}
            //           nodeLabel={label}
            //           onClick={this.toggle.bind(this)}
            //           tabIndex={0}
            //           onKeyPress={this.toggle.bind(this)}>
            <div>
                <h1 style={{fontWeight: 'bold'}} onClick={this.toggle.bind(this)}>
                    {this.props.name}—a {this.props.type} production
                </h1>
                <span>Requirements:</span>
                <ul>
                    <Requirement {...this.props} />
                </ul>
            </div>
            // </TreeView>
        )
    }
}
