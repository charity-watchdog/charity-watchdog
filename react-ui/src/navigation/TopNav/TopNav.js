import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigationActions from '../../../actions/navigationActions';
import PropTypes from 'prop-types';
import './TopNav.css';

class TopNav extends Component {
    handleAccountClick = () => {
        this.props.navigationActions.changeView('Account Details');
    }

    getColourClass = () => {
        switch (this.props.view) {
            case 'Balance':
                return ' blue';
            case 'Search':
                return ' purple';
            case 'Activation Requests':
                return ' orange';
            default:
                return ' grey';
        }
    }

    renderRefreshIcon = () => {
        let toRender;
        if (this.props.view === 'Balance') {
            toRender = (
                <div className="refresh-icon material-icons">
                    cached
                </div>
            );
        }

        return toRender;
    }

    render() {
        const {
            view
        } = this.props;

        return (
            <div className={'top-nav' + this.getColourClass()}>
                <div className="profile-info-container">
                    <div className="current-community">Lighthouse Labs</div>
                    <div className="account-navigation-container">
                        {view === 'Account Details' && <div className="highlight" />}
                        <i
                            className="profile-access material-icons"
                            onClick={this.handleAccountClick}
                        >
                            account_circle
                        </i>
                    </div>
                </div>
                <div className="header-container">
                    <div className="header">{view}</div>
                    {this.renderRefreshIcon()}
                </div>
            </div>
        );
    }
}

TopNav.propTypes = {
    navigationActions: PropTypes.object,
    view: PropTypes.string
};

function mapStateToProps(state) {
    return {
        view: state.navigation.view
    };
}

function mapDispatchToProps(dispatch) {
    return {
        navigationActions: bindActionCreators(navigationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNav);
