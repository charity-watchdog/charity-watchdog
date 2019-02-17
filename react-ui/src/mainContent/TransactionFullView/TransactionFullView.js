import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TransactionFullView.css';

class TransactionFullView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submissionButtonPressed: false
        };
    }

    handleTransactionModalOpen = () => {
        this.props.setTransactionInModal(
            false,
            ''
        );
    }

    submitProof = () => {
        if (this.state.submissionButtonPressed) {
            return;
        } else {
            this.setState({ submissionButtonPressed: true });
        }

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
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(response.json().error);
                }

                return response.json();
            }).then(json => {
                const charityID = json.data;

                this.handleTransactionModalOpen();
                this.props.setCharityInView(charityID);
                this.props.setProof(charityID);
            }).catch(e => {
                console.error(e);
                this.setState({
                    error: `Failed to upload proof: ${e}`,
                    transactionsRequestState: 'ERROR',
                    submissionButtonPressed: false,
                });
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

                    <div className="transaction-dollar-value">
                        {(transaction.eth_value * 1260000).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                    <div className="transaction-eth-value">
                        ~ {transaction.eth_value * 10000}
                    </div>
                    <div className="transaction-to-address">
                        <div className="send-icon material-icons">send</div>
                        <div className="address-info">{transaction.to_address}</div>
                    </div>
                    <div className="transaction-timestamp">
                        <div className="date-icon material-icons">date_range</div>
                        <div className="timestamp-info">{transaction.timestamp}</div>
                    </div>
                    <div className="transaction-description-input">
                        <div className="description-icon material-icons">chrome_reader_mode</div>
                        <textarea
                            ref={(element) => this._textarea = element}
                            name="description"
                            className="description-proof"
                            onChange={this.handleDescriptionChange}
                        />
                    </div>
                    <div className="spend-proof">
                        <div className="spend-icon material-icons">camera_alt</div>
                        <label className="proof-image">
                            <input
                                ref={(element) => this._input = element}
                                type="file"
                                title="proof-image"
                                name="proof-image"
                                className="proof-image-submit"
                            />
                        </label>
                    </div>
                    <button
                        className={this.state.submissionButtonPressed ? "submit-proof-button blue" : "submit-proof-button solid blue"}
                        onClick={this.submitProof}
                    >
                        save
                    </button>
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

                    <div className="transaction-dollar-value">
                        {(transaction.eth_value * 1260000).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                    <div className="transaction-eth-value">
                        ~ {transaction.eth_value * 10000}
                    </div>
                    <div className="transaction-to-address">
                        <div className="send-icon material-icons">send</div>
                        <div className="address-info">{transaction.to_address}</div>
                    </div>
                    <div className="transaction-timestamp">
                        <div className="date-icon material-icons">date_range</div>
                        <div className="timestamp-info">{transaction.timestamp}</div>
                    </div>
                    <div className="transaction-description">
                        <div className="description-icon material-icons">chrome_reader_mode</div>
                        <div className="description-info">{transaction.description}</div>
                    </div>
                    <div className="spend-proof">
                        <div className="spend-icon material-icons">camera_alt</div>
                        <img
                            src={transaction.proof}
                            alt="Proof of spend"
                            className="image-proof"
                        />
                    </div>
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
