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
            description,
            missingProof,
            logoUrl,
        } = this.props;

        return (
            <div
                className="charity-preview-container"
                onClick={this.handleSetCharityInView()}
            >
                <div
                    className="charity-preview-banner"
                    style={{
                        backgroundImage: `url(${logoUrl})`
                    }}
                >
                    {missingProof && <div className="warning-icon material-icons">error</div>}
                    {missingProof && <div className="white-underlay" />}
                </div>
                <div className="charity-name">{name}</div>
                <div className="charity-description">{description}</div>
            </div>
        );
    }
}

CharityPreview.propTypes = {
    logoUrl: PropTypes.string,
    charityID: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    walletAddress: PropTypes.string,
    missingProof: PropTypes.string,
    setCharityInView: PropTypes.func
};

export default CharityPreview;
