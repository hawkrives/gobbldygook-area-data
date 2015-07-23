import React, {Component, PropTypes} from 'react'

import Requirement from './requirement'

import './area.less'

export default class AreaOfStudy extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        result: PropTypes.object.isRequired,
        revision: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
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
                <h1 className='area--title'>{this.props.name}</h1>
                <Requirement {...this.props} topLevel />
            </div>
        )
    }
}
