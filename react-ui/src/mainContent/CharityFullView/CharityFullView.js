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
            setTransactionInModal
        } = this.props;
        let content;

        switch(transactionsRequestState) {
            case 'INIT':
            case 'FETCHING':
                content = <p>Loading...</p>;
                break;
            case 'DONE':
                let transactionsContent;

                if (transactions.length === 0) {
                    transactionsContent = <p>This charity does not have any spends yet.</p>
                } else {
                    transactionsContent = transactions.map((transaction) => {
                        return (
                            <TransactionPreview
                                key={transaction.id}
                                transactionID={transaction.id}
                                toAddress={transaction.to_address}
                                description={transaction.description}
                                timestamp={transaction.timestamp}
                                ethValue={transaction.eth_value}
                                proof={transaction.proof}
                                setTransactionInModal={setTransactionInModal}
                            />
                        );
                    });
                }


                content = (
                    <Fragment>
                        <div className="charity-balance-container">
                            <div className="section-description">balance</div>
                            <div className="amount-container">
                                <div className="balance-amount">{(this.props.balanceInView * 126000).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                                <button className="solid blue">donate</button>
                            </div>
                            <div className="balance-in-eth">~ {this.props.balanceInView * 1000} ETH</div>
                        </div>
                        <div className="transactions-container">
                            <div className="section-description transactions">transactions</div>
                            <div className="transactions-list">
                                {transactionsContent}
                            </div>
                        </div>
                    </Fragment>
                );
                break;
            case 'ERROR':
                content = (<p>{error}</p>);
                break;
        }

        return (
            <div className="charity-full-view-container">
                <div
                    className="charity-banner"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1547014751-009831e5bc73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)`
                    }}
                >
                    <button
                        className="back-button"
                        onClick={this.handleSetCharityInView}
                    >
                        back
                    </button>

                    {missingProof ?
                        <div className="warning-container">
                            <div className="white-underlayer" />
                            <div className="warning-icon view-icon material-icons">error</div>
                            <div className="warning-description">no proof</div>
                        </div>
                    :
                        null
                    }
                </div>
                <h1 className="charity-name">
                    {name}
                </h1>
                <p className="charity-description">
                    {description}
                </p>
                {content}
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
    setTransactionInModal: PropTypes.func,
    transactionsRequestState: PropTypes.string,
    logoUrl: PropTypes.string,
    charityID: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    walletAddress: PropTypes.string,
    missingProof: PropTypes.string,
    balanceInView: PropTypes.string,
};

export default CharityFullView;
