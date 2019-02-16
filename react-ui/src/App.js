import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      charities: [],
      charityRequestState: 'INIT',
    };
  }

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
    const { charityRequestState, charities, error } = this.state;
    let content;

    switch(charityRequestState) {
      case 'INIT':
      case 'FETCHING':
        content = (<p>Loading...</p>);
        break;
      case 'DONE':
        content = charities.map(charity => <p>{charity.name} <strong>{charity.wallet_address}</strong></p>);
        break;
      case 'ERROR':
        content = (<p>{error}</p>);
        break;
      default:
        content = (<p>Default? Should never happen</p>);
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {content}
        </header>
      </div>
    );
  }
}

export default App;
