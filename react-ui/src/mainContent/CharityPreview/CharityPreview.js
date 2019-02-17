import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CharityPreview.css';

class CharityPreview extends Component {
    handleSetCharityInView = () => {
        const {
            charityID,
            setCharityInView
        } = this.props;

        return () => { setCharityInView(charityID); }
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
                <div
                    className="charity-preview-image"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1547014751-009831e5bc73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)`
                    }}
                />
                <div className="charity-name">{name}</div>
                <div className="charity-description">{description}</div>
            </div>
        );
    }
}

CharityPreview.propTypes = {
    charityID: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    walletAddress: PropTypes.string,
    missingProof: PropTypes.string,
    setCharityInView: PropTypes.func
};

export default CharityPreview;
