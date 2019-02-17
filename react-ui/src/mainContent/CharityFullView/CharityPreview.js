import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CharityPreview.css';

class CharityPreview extends Component {
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
                className="charity-preview-container"
                onClick={this.handleSetCharityInView()}
            >
                <div className="charity-name">{name}</div>
                <div className="charity-name">{description}</div>
            </div>
        );
    }
}

CharityPreview.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    walletAddress: PropTypes.string,
    missingProof: PropTypes.string,
    setCharityInView: PropTypes.func
};

export default CharityPreview;
