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
        return (
            <div className="transaction-modal">
                <button
                    className="close-button"
                    onClick={this.handleTransactionModalOpen}
                >
                    close
                </button>
                HAHAHAAH
            </div>
        );
    }
}

TransactionFullView.propTypes = {
    transactions:
        PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                to_address: PropTypes.string,
                description: PropTypes.string,
                timestamp: PropTypes.string,
                eth_value: PropTypes.string,
                proof: PropTypes.string,
            })
        ),
    setTransactionInModal: PropTypes.func,
    transactionInView: PropTypes.string,
};

export default TransactionFullView;
