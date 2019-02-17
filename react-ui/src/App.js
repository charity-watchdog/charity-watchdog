import React, { Component } from 'react';

import TopNav from "./navigation/TopNav/TopNav";
import MainContent from "./mainContent/MainContent/MainContent";
// import CharityPreview from "./mainContent/CharityPreview/CharityPreview";
import BottomNav from "./navigation/BottomNav/BottomNav";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            charities: [],
            charityRequestState: 'INIT',
            view: 'INTRO', // 'BROWSE', 'YOUR_CHARITY'
            charityInBrowse: '', //  by ETH Address. If own charity -> switch to 'YOUR_CHARITY' view
            searchTerms: '',
            searchBarOpen: false,
            modalOpen: false
        };
    }

    changeView = (view) => {
        this.setState({
            view,
            searchTerms: '',
            searchBarOpen: false
        });
    }

    updateSearchTerms = (searchTerms) => { this.setState({ searchTerms }); }

    setSearchBarOpen = (searchBarOpen) => { this.setState({ searchBarOpen }); }

    componentDidMount() {
        this.setState({charityRequestState: 'FETCHING' }, () => {
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
            searchBarOpen
        } = this.state;
        let content;

        switch(charityRequestState) {
            case 'INIT':
            case 'FETCHING':
                content = (<p>Loading...</p>);
                break;
            case 'DONE':
                content = charities.map((charity) => {
                    // name
                    // description
                    // wallet_address
                    // missing_proof
                    // return <p>{charity.name} <strong>{charity.}</strong></p>;
                    return <p>{charity.name} <strong>{charity.wallet_address}</strong></p>;
                });
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
                <MainContent
                    view={view}
                    changeView={this.changeView}
                    content={content}
                />
                <BottomNav
                    view={view}
                    changeView={this.changeView}
                />
            </div>
        );
    }
}

export default App;
