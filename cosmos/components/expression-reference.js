import React, {Component, PropTypes} from 'react'
import styles from './expression-reference.less'
import cx from 'classnames'

export default class Reference extends Component {
    static propTypes = {
        $requirement: PropTypes.string.isRequired,
        _result: PropTypes.bool,
        style: PropTypes.object,
    }

    render() {
        const {$requirement: requirement} = this.props
        const name = <span className='name'>{requirement}</span>

        return (
            <span className={cx('reference', {matched: this.props._result})}
                  style={this.props.style}>
                {name}
            </span>
        )
    }
}
