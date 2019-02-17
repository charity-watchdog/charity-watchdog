import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TransactionPreview from "../TransactionPreview/TransactionPreview";
import './CharityFullView.css';

class CharityFullView extends Component {
    handleSetCharityInView = () => { this.props.setCharityInView(''); }

    render() {
        const {
            transactionsRequestState,
            transactions,
            error,
            logoUrl,
            charityID,
            name,
            description,
            walletAddress,
            missingProof,
        } = this.props;
        let content;

        switch(transactionsRequestState) {
            case 'INIT':
            case 'FETCHING':
                content = <p>Loading...</p>;
                break;
            case 'DONE':
                if (transactions.length === 0) {
                    content = <p>This charity does not have any spends yet.</p>
                } else {
                    content = transactions.map((transaction) => {
                        return (
                            <TransactionPreview
                                transactionID={transaction.id}
                                toAddress={transaction.to_address}
                                description={transaction.description}
                                timestamp={transaction.timestamp}
                                ethValue={transaction.eth_value}
                                proof={transaction.proof}
                            />
                        );
                    });
                }
                break;
            case 'ERROR':
                content = (<p>{error}</p>);
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
                <h1>
                    {name}
                </h1>
                <p>
                    {description}
                </p>
                <Fragment>
                    {content}
                </Fragment>
            </div>
        );
    }
}

CharityFullView.propTypes = {
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
    setCharityInView: PropTypes.func,
    transactionsRequestState: PropTypes.string,
    logoUrl: PropTypes.string,
    charityID: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    walletAddress: PropTypes.string,
    missingProof: PropTypes.string,
};

export default CharityFullView;
