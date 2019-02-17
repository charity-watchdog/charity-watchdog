import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MainContent.css';

class MainContent extends Component {
    render() {
        const {
            charityInView
        } = this.props;

        let toRender = (
            <div className="main-content">
                {this.props.content}
            </div>
        );

        if (charityInView) {
            toRender = (
                <div className="main-content">
                    {this.props.content}
                </div>
            );
        }

        return toRender;
    }
}

MainContent.propTypes = {
    view: PropTypes.string,
    charityInView: PropTypes.string,
    changeView: PropTypes.func,
    content: PropTypes.element

};

export default MainContent;
