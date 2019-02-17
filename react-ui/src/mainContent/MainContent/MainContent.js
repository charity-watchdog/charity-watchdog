import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MainContent.css';

class MainContent extends Component {
    // renderCurrentView = () => {
    //     const {
    //         view
    //     } = this.props;
    //
    //     switch (view) {
    //         case 'BROWSE':
    //             return <Balance />;
    //         case 'YOUR_CHARITY':
    //             return <CharityFullView />
    //         case 'Search':
    //             return <Search />
    //         case 'Activation Requests':
    //             return <ActivationRequests />
    //         default:
    //             return <div>Something is broken</div>;
    //     }
    // }

    render() {
        return (
            <div className="main-content">
                {this.props.content}
            </div>
        );
    }
}

MainContent.propTypes = {
    view: PropTypes.string,
    content: PropTypes.element

};

export default MainContent;
