import React, { Component } from 'react';

import TopNav from "./navigation/TopNav/TopNav";
import CharityPreview from "./mainContent/CharityPreview/CharityPreview";
import BottomNav from "./navigation/BottomNav/BottomNav";

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
            charityInView: '', //  by ETH Address. If own charity -> switch to 'YOUR_CHARITY' view
            searchTerms: '',
            searchBarOpen: false,
            modalOpen: false
        };
    }

    changeView = (view) => {
        this.setState({
            view,
            searchTerms: '',
            searchBarOpen: false,
            setCharityInView: ''
        });
    }

    setCharityInView = (charity) => {
        this.setState({ charityInView: charity });
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
            charityInView
        } = this.state;
        let content;

        switch(charityRequestState) {
            case 'INIT':
            case 'FETCHING':
                content = (<p>Loading...</p>);
                break;
            case 'DONE':
                if (charityInView) {
                    content = (
                        <CharityFullView
                            transactions={tansactions}
                            transactionsRequestState={transactionsRequestState}
                            setCharityInView={this.setCharityInView}
                        />
                    );
                } else {
                    content = charities.map((charity) => {
                        return (
                            <CharityPreview
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
            default:
                content = (<p>Default? Should never happen</p>);
                break;
        }

        return (
            <div className="App">
                <TopNav
                    view={view}
                    searchTerms={searchTerms}
                    searchBarOpen={searchBarOpen}
                    setSearchBarOpen={this.setSearchBarOpen}
                    updateSearchTerms={this.updateSearchTerms}
                />
                <div className="main-content">
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

export default App;
