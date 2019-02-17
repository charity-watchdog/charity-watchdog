import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import TransactionPreview from "../TransactionPreview/TransactionPreview";
import './CharityFullView.css';

class CharityFullView extends Component {
    handleSetCharityInView = () => { this.props.setCharityInView(''); }

    render() {
        const {
            transactionsRequestState,
            transactions
        } = this.props;

        switch(transactionsRequestState) {
            case 'INIT':
            case 'FETCHING':
                content = <p>Loading...</p>;
                break;
            case 'DONE':
                content = transactions.map((transaction) => {
                    // return (
                    //     <TransactionPreview
                    //         charityID={transaction.charity_id}
                    //         toAddress={transaction.to_address}
                    //         description={transaction.description}
                    //         timestamp={transaction.timestamp}
                    //         ethValue={transaction.eth_value}
                    //         proof={transaction.proof}
                    //     />
                    // );
                }
                break;
            case 'ERROR':
                content = (<p>{error}</p>);
                break;
            default:
                content = (<p>Default? Should never happen</p>);
                break;
        }

        return (
            <div
                className="charity-full-view-container"
            >
                <button
                    className="back-button"
                    onClick={this.handleSetCharityInView}
                >
                    back-button
                </button>
                {content}
            </div>
        );
    }
}

CharityFullView.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
            charity_id: PropTypes.number,
            to_address: PropTypes.string,
            description: PropTypes.string,
            timestamp: PropTypes.string,
            eth_value: PropTypes.number,
            proof: PropTypes.string
        })),
    setCharityInView: PropTypes.func,
    transactionsRequestState: PropTypes.string
};

export default CharityFullView;
