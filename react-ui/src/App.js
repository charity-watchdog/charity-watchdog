import React, { Component } from 'react';

import TopNav from "./navigation/TopNav/TopNav";
import CharityPreview from "./mainContent/CharityPreview/CharityPreview";
import CharityFullView from "./mainContent/CharityFullView/CharityFullView";
import BottomNav from "./navigation/BottomNav/BottomNav";
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

import './App.css';

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
            modalOpen: false
        };
    }

    changeView = (view) => {
        if (view === 'YOUR_CHARITY') {
            const fm = new Fortmatic('pk_live_C4B09BA5D33FB539');
            const web3 = new Web3(fm.getProvider());
            fm.user.login().then(() => {
                web3.eth.getAccounts().then(console.log); // ['0x...']
            });
        }

        this.setState({
            view,
            searchTerms: '',
            searchBarOpen: false,
            setCharityInView: ''
        });
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
