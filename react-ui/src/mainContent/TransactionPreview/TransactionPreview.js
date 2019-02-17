import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TransactionPreview.css';

class TransactionPreview extends Component {
    render() {
        const {
            toAddress,
            description,
            timestamp,
            ethValue,
            proof
        } = this.props;

        let dollarValue = ethValue * 1260000;
        dollarValue = dollarValue.toLocaleString(
            undefined,
            { minimumFractionDigits: 2 }
        );

        let transactionClass = 'transaction-preview';
        if (description) {
            transactionClass = 'transaction-preview pink';
        }

        return (
            <div className={transactionClass}>
                {description && <div className="warning-icon view-icon material-icons">error</div>}
                <div className="dollar-value">${dollarValue}</div>
                <div className="eth-value">~{ethValue * 10000} ETH</div>
                <div className="view-icon material-icons">visibility</div>
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
