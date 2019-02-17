import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CharityFullView.css';

class CharityFullView extends Component {
    handleSetCharityInView = () => {
        const {
            walletAddress,
            setCharityInView
        } = this.props;

        return () => { setCharityInView(walletAddress); }
    }

    render() {
        const {
            name,
            description
        } = this.props;

        return (
            <div
                className="charity-full-view-container"
                onClick={this.handleSetCharityInView()}
            >
                <div className="charity-name">{name}</div>
                <div className="charity-name">{description}</div>
            </div>
        );
    }
}

CharityFullView.propTypes = {
    tansactions: PropTypes.arrayOf(PropTypes.shape({
            charity_id: PropTypes.number,
            to_address: PropTypes.string,
            description: PropTypes.string,
            timestamp: PropTypes.string,
            eth_value: PropTypes.number,
            proof: PropTypes.string
        })),
    transactionsRequestState: PropTypes.string
};

export default CharityFullView;
