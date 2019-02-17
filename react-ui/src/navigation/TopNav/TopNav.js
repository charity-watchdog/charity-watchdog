import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TopNav.css';

class TopNav extends Component {
    handleSearchBarOpen = (barState) => {
        return () => {
            this.props.setSearchBarOpen(barState);
        }
    }

    renderSearchIcon = () => {
        const {
            searchBarOpen,
            setSearchBarOpen
        } = this.props;
        let handleSearhBarOpen;

        if (searchBarOpen) {
            handleSearhBarOpen = () => { setSearchBarOpen(false); }
        } else {
            handleSearhBarOpen = () => { setSearchBarOpen(true); }
        }

        return (
            <i
                className="profile-access material-icons"
                onClick={handleSearhBarOpen}
            >
                search
            </i>
        );
    }

    render() {
        const {
            view
        } = this.props;

        return (
            <div className="top-nav blue">
                <div className="logotype">Charity Watchdog</div>
                <div className="search-container">
                    {view === 'BROWSE' && this.renderSearchIcon()}
                </div>
            </div>
        );
    }
}

TopNav.propTypes = {
    view: PropTypes.string,
    searchTerms: PropTypes.string,
    searchBarOpen: PropTypes.bool,
    setSearchBarOpen: PropTypes.func,
    updateSearchTerms: PropTypes.func,
};

export default TopNav;
