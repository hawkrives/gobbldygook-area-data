import React, {Component, PropTypes} from 'react'
import styles from './expression-modifier.less'
import cx from 'classnames'

export default class Reference extends Component {
    static propTypes = {
        style: PropTypes.object,
        _result: PropTypes.bool,
        $type: PropTypes.oneOf(['modifier']).isRequired,
        $count: PropTypes.number.isRequired,
        $what: PropTypes.oneOf(['course', 'credit', 'department']).isRequired,
        $from: PropTypes.oneOf(['children', 'filter', 'where']).isRequired,
        $where: PropTypes.shape({
            $type: PropTypes.oneOf(['qualification']).isRequired,
            $key: PropTypes.string.isRequired,
            $value: PropTypes.object.isRequired,
        }),
        $children: PropTypes.oneOf([
            '$all',
            PropTypes.arrayOf(PropTypes.shape({
                $type: PropTypes.oneOf('reference'),
                $requirement: PropTypes.string,
            })),
        ]),
    }

    render() {
        // You have {M} of {N} needed {THING} from
        // - $all: the courses which were used when computing all of the child requirements
        // - $some: the courses which were used when computing A, B, and C
        // - $where: the courses whose {x OP y}
        // - $filter:
        //   - $where: the courses whose {x OP y}
        //   - $of: among {COURSES}

        const description = null
        const count = null
        const thing = null

        return (
            <span className={cx('course', {matched: this.props._result})}
                  style={this.props.style}>
            </span>
        )
    }
}
