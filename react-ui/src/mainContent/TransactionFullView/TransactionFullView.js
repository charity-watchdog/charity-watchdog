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

    submitProof = () => {
        const transactionID = this.props.transaction.id;
        const file = this._input.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            fetch(`/api/v1/transaction/${transactionID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "description": this._textarea.value,
                    "proofImage": reader.result,
                }),
            });
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
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

                    <div>
                        <span className="transaction-eth-value">{transaction.eth_value}</span>
                    </div>
                    <div>
                        <span className="transaction-to-address">{transaction.to_address}</span>
                    </div>
                    <div>
                        <span className="transaction-timestamp">{transaction.timestamp}</span>
                    </div>
                    <div>
                        <label className="description-label">
                            <textarea
                                ref={(element) => this._textarea = element}
                                name="description"
                                onChange={this.handleDescriptionChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label className="proof-image">
                            <input
                                ref={(element) => this._input = element}
                                type="file"
                                title="proof-image"
                                name="proof-image"
                            />
                        </label>
                    </div>
                    <button className="submit-proof" onClick={this.submitProof} />
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

                    <div>
                        <span className="transaction-eth-value">{transaction.eth_value}</span>
                    </div>
                    <div>
                        <span className="transaction-to-address">{transaction.to_address}</span>
                    </div>
                    <div>
                        <span className="transaction-timestamp">{transaction.timestamp}</span>
                    </div>
                    <div>
                        <span>{transaction.description}</span>
                    </div>
                        <img src={transaction.proof} alt="Proof of spend" />
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
