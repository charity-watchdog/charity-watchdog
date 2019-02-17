import React, { Component } from 'react';

import TopNav from "./navigation/TopNav/TopNav";
import CharityPreview from "./mainContent/CharityPreview/CharityPreview";
import CharityFullView from "./mainContent/CharityFullView/CharityFullView";
import TransactionFullView from "./mainContent/TransactionFullView/TransactionFullView";
import BottomNav from "./navigation/BottomNav/BottomNav";
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

import './App.css';

const fm = new Fortmatic('pk_live_C4B09BA5D33FB539');
const web3 = new Web3(fm.getProvider());

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            charities: [],
            transactions: [],
            charityRequestState: 'INIT',
            transactionsRequestState: 'INIT',
            view: 'INTRO', // 'BROWSE', 'YOUR_CHARITY'
            charityInView: '', //  by chairtyID. If own charity -> switch to 'YOUR_CHARITY' view
            searchTerms: '',
            searchBarOpen: false,
            modalOpen: false,
            transactionInView: ''
        };
    }

    changeView = (view) => {
        if (view === 'YOUR_CHARITY') {
            web3.currentProvider.enable();
            web3.eth.getAccounts((error, accounts) => {
                if (error) throw error;
                const accountAddress = accounts[0]
                console.log(accountAddress); // ['0x...']

                if (0 < this.state.charities.length) {
                    const myCharity = this.state.charities.find((charity) => {
                        return charity.wallet_address === accountAddress
                    });

                    this.setCharityInView(myCharity.id);
                } else {
                    this.setState({
                        view,
                        searchTerms: '',
                        searchBarOpen: false,
                        setCharityInView: ''
                    });
                }
            });
        } else {
            this.setState({
                view,
                searchTerms: '',
                searchBarOpen: false,
                setCharityInView: ''
            });
        }
    }

    setCharityInView = (charityID) => {
        this.setState({ charityInView: charityID, transactionsRequestState: 'FETCHING' }, () => {
            fetch(`/api/v1/charity/${charityID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.json().error);
                    }

                    return response.json();
                })
                .then(json => {
                    this.setState({
                        error: '',
                        transactions: json.data,
                        transactionsRequestState: 'DONE',
                    });
                }).catch(e => {
                    console.error(e);
                    this.setState({
                        error: `Failed to fetch transactions: ${e}`,
                        transactionsRequestState: 'ERROR',
                    });
                })
            ;
        });
    }

    updateSearchTerms = (searchTerms) => { this.setState({ searchTerms }); }

    setSearchBarOpen = (searchBarOpen) => { this.setState({ searchBarOpen }); }

    setTransactionInModal = (modalOpen, transactionInView) => {
        this.setState({
            modalOpen,
            transactionInView
        });
    }

    componentDidMount() {
        this.setState({ charityRequestState: 'FETCHING' }, () => {
            fetch('/api/v1/charity')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.json().error);
                }

                return response.json();
            })
            .then(json => {
                this.setState({
                    error: '',
                    charities: json.data,
                    charityRequestState: 'DONE',
                });
            }).catch(e => {
                console.error(e);
                this.setState({
                    error: `Failed to fetch charities: ${e}`,
                    charityRequestState: 'ERROR',
                });
            });
        });
    }

    render() {
        const {
            charityRequestState,
            charities,
            error,
            view,
            searchTerms,
            searchBarOpen,
            charityInView,
            transactions,
            transactionsRequestState,
            transactionInView,
            modalOpen
        } = this.state;
        let content;

        switch(charityRequestState) {
            case 'INIT':
            case 'FETCHING':
                content = (<p>Loading...</p>);
                break;
            case 'DONE':
                if (charityInView) {
                    const charity = charities.find((charity) => {
                        return charity.id === charityInView;
                    });

                    content = (
                        <CharityFullView
                            transactions={transactions}
                            transactionsRequestState={transactionsRequestState}
                            setCharityInView={this.setCharityInView}
                            error={error}
                            logoUrl={charity.logo_url}
                            charityID={charity.id}
                            name={charity.name}
                            description={charity.description}
                            walletAddress={charity.wallet_address}
                            missingProof={charity.missing_proof}
                            setTransactionInModal={this.setTransactionInModal}
                        />
                    );
                } else {
                    content = charities.map((charity) => {
                        return (
                            <CharityPreview
                                logoUrl={charity.logo_url}
                                charityID={charity.id}
                                name={charity.name}
                                description={charity.description}
                                walletAddress={charity.wallet_address}
                                missingProof={charity.missing_proof}
                                setCharityInView={this.setCharityInView}
                            />
                        );
                    });
                }
                break;
            case 'ERROR':
                content = (<p>{error}</p>);
                break;
        }

        switch (view) {
            case 'INTRO':
                return (
                    <div className="App">
                        <div className="Intro" onClick={() => this.setState({ view: 'BROWSE' })}>
                            <h1>100%</h1>
                            <h2>transparent</h2>
                            <h2>charities</h2>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="App">
                        {transactionInView && modalOpen &&
                            <TransactionFullView
                                transactions={transactions}
                                transactionInView={transactionInView}
                                setTransactionInModal={this.setTransactionInModal}
                            />
                        }
                        {transactionInView && modalOpen && <div className="white-overlay" />}
                        <TopNav
                            view={view}
                            searchTerms={searchTerms}
                            searchBarOpen={searchBarOpen}
                            setSearchBarOpen={this.setSearchBarOpen}
                            updateSearchTerms={this.updateSearchTerms}
                        />
                        <div
                            className={
                                charityInView ?
                                    "main-content"
                                :
                                    "main-content list"
                            }
                        >
                            {content}
                        </div>
                        <BottomNav
                            view={view}
                            changeView={this.changeView}
                        />
                    </div>
                );
        }
    }
}

export default App;
