import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TransactionPreview.css';

class TransactionPreview extends Component {
    render() {
        const { toAddress, description, timestamp, ethValue, proof } = this.props;

        return (
            <div>
                <span>{ethValue}</span>
                <span>{timestamp}</span>
                <span>Eye Icon</span>
            </div>
        );
    }
}

TransactionPreview.propTypes = {
    transactionID: PropTypes.number,
    toAddress: PropTypes.string,
    description: PropTypes.string,
    timestamp: PropTypes.string,
    ethValue: PropTypes.string,
    proof: PropTypes.string,
};

export default TransactionPreview;
