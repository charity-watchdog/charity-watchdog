import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BottomNav.css';

class BottomNav extends Component {
    handleMenuClick = (newState) => {
        return () => {
            this.props.navigationActions.changeView(newState);
        }
    }

    render() {
        const {
            view
        } = this.props;

        return (
            <div className="bottom-nav">
                <div
                    className="menu-section"
                    onClick={this.handleMenuClick('BROWSE')}
                >
                    <div className="menu-item-container">
                        <div className="menu-icon material-icons">account_balance_wallet</div>
                        <div className="menu-title">
                            {view ==="Balance" && <div className="highlight" />}
                            <div className="title">balance</div>
                        </div>
                    </div>
                </div>
                <div
                    className={view === "Search" ?
                            "menu-section purple"
                        :
                            "menu-section"
                    }
                    onClick={this.handleMenuClick('Search')}
                >
                    <div className="menu-item-container">
                        <div className="menu-icon material-icons">search</div>
                        <div className="menu-title">
                            {view ==="Search" && <div className="highlight" />}
                            <div className="title">search</div>
                        </div>
                    </div>
                </div>
                {this.renderActivationRequests()}
            </div>
        );
    }
}

BottomNav.propTypes = {
    navigationActions: PropTypes.object,
    view: PropTypes.string
};

export default BottomNav;
