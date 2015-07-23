import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'
import keys from 'lodash/object/keys'

import isRequirementName from '../../lib/is-requirement-name'

import Expression from './expression'

import './requirement.less'

export default class Requirement extends Component {
    static propTypes = {
        computed: PropTypes.bool,
        filter: PropTypes.object,
        message: PropTypes.string,
        name: PropTypes.string,
        result: PropTypes.object,
        topLevel: PropTypes.bool.isRequired,
    }

    render() {
        const childKeys = filter(keys(this.props), isRequirementName)

        const result = this.props.result
            ? <div className='requirement--result'><Expression expr={this.props.result || {}} ctx={this.props} /></div>
            : null

        const message = this.props.message
            ? <p className='requirement--message'>{this.props.message}</p>
            : null

        const filterEl = this.props.filter
            ? <div className='requirement--filter'>Filter: {this.props.filter}</div>
            : null

        const wasComputed = this.props.hasOwnProperty('computed')
        const computationResult = this.props.computed

        const title = this.props.topLevel
            ? null
            : <h2 className={`requirement--title ${wasComputed ? computationResult ? 'computed-success' : 'computed-failure' : 'computed-not'}`}>{this.props.name}</h2>

        return (
            <div className={`requirement`}>
                {title}
                {message}
                {filterEl}
                {result}
                <div className='children'>
                    {childKeys.map(k => <Requirement key={k} name={k} {...this.props[k]} />)}
                </div>
            </div>
        )
    }
}
