import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BottomNav.css';

class BottomNav extends Component {
    handleNavClick = (newView) => {
        return () => { this.props.changeView(newView); }
    }

    render() {
        const { view } = this.props;

        return (
            <div className="bottom-nav">
                <div
                    className={
                        view === 'BROWSE' ?
                            "menu-section blue"
                        :
                            "menu-section"
                    }
                    onClick={this.handleNavClick('BROWSE')}
                >
                    <div className="menu-item-container">
                        <div className="menu-icon material-icons">loyalty</div>
                        <div className="menu-title">
                            {view === "BROWSE" && <div className="highlight" />}
                            <div className="title">browse</div>
                        </div>
                    </div>
                </div>
                <div
                    className={
                        view === 'YOUR_CHARITY' ?
                            "menu-section blue"
                        :
                            "menu-section"
                    }
                    onClick={this.handleNavClick('YOUR_CHARITY')}
                >
                    <div className="menu-item-container">
                        <div className="menu-icon material-icons">accessibility_new</div>
                        <div className="menu-title">
                            {view === "YOUR_CHARITY" && <div className="highlight" />}
                            <div className="title">your charity</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

BottomNav.propTypes = {
    changeView: PropTypes.func,
    view: PropTypes.string
};

export default BottomNav;
