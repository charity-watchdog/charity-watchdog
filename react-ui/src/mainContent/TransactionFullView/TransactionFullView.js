import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TransactionFullView.css';

class TransactionFullView extends Component {

    handleTransactionModalOpen = () => {
        this.props.setTransactionInModal(
            false,
            ''
        );
    }

    render() {
        const { ownTransaction, transaction } = this.props;

        // This is our transaction, and we haven't given it a description
        if (ownTransaction && !transaction.description) {
            return (
                <div className="transaction-modal">
                    <button
                        className="close-button"
                        onClick={this.handleTransactionModalOpen}
                    >
                        X
                    </button>

                    <span className="transaction-eth-value">{transaction.eth_value}</span>
                    <span className="transaction-to-address">{transaction.to_address}</span>
                    <span className="transaction-timestamp">{transaction.timestamp}</span>
                    <label className="description-label">
                        <textarea name="description" />
                    </label>
                    <label className="proof-image">
                        <input type="file" title="proof-image" name="proof-image" />
                    </label>
                </div>
            );
        } else {
            return (
                <div className="transaction-modal">
                    <button
                        className="close-button"
                        onClick={this.handleTransactionModalOpen}
                    >
                        X
                    </button>

                    <span className="transaction-eth-value">{transaction.eth_value}</span>
                    <span className="transaction-to-address">{transaction.to_address}</span>
                    <span className="transaction-timestamp">{transaction.timestamp}</span>
                    <span>{transaction.description}</span>
                    <img src={transaction.proof} alt="Image proof of spend" />
                </div>
            );
        }
    }

}

TransactionFullView.propTypes = {
    transaction:
        PropTypes.shape({
            id: PropTypes.number,
            to_address: PropTypes.string,
            description: PropTypes.string,
            timestamp: PropTypes.string,
            eth_value: PropTypes.string,
            proof: PropTypes.string,
        }),
    setTransactionInModal: PropTypes.func,
    ownTransaction: PropTypes.bool,
};

export default TransactionFullView;
