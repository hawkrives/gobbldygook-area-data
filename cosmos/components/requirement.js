import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'
import keys from 'lodash/object/keys'

import isRequirementName from '../../lib/is-requirement-name'

import Expression from './expression'

import './requirement.less'

class Requirement extends Component {
    static propTypes = {
        computed: PropTypes.bool,
        filter: PropTypes.object,
        message: PropTypes.string,
        name: PropTypes.string,
        result: PropTypes.object,
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
