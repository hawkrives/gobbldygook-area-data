import React, {Component, PropTypes} from 'react'
import styles from './expression-course.less'
import cx from 'classnames'

export default class Course extends Component {
    static propTypes = {
        department: PropTypes.arrayOf(PropTypes.string).isRequired,
        number: PropTypes.number.isRequired,
        section: PropTypes.string,
        year: PropTypes.number,
        semester: PropTypes.number,
        lab: PropTypes.bool,
        international: PropTypes.bool,
        style: PropTypes.object,
    }

    render() {
        const department = (
            <span className='department'>
                {this.props.department.join('/')}
            </span>)
        const number = (<span className='number'>{this.props.number}</span>)

        const international = this.props.international
            ? (<span className='international'>I</span>)
            : null
        const lab = this.props.lab
            ? (<span className='lab'>L</span>)
            : null

        const section = this.props.section
            ? (<span className='section'>.{this.props.section}</span>)
            : null

        const year = this.props.year
            ? (<span className='year'>{this.props.year}</span>)
            : null
        const semester = this.props.semester
            ? (<span className='semester'>{this.props.semester}</span>)
            : null

        /////

        const basicIdentifiers = (
            <div className='basic-identifiers'>
                {department}
                <span>
                    {number}{international}{lab}
                    {section}
                </span>
            </div>
        )

        const temporalIdentifiers = (year || semester)
            ? (<div className='temporal'>
                <span>S{semester}</span>
                <span>{year}</span>
            </div>)
            : null

        return (
            <span className={cx('course', {matched: this.props._result})} style={this.props.style}>
                {basicIdentifiers}
                {temporalIdentifiers}
            </span>
        )
    }
}
