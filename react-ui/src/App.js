import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true
    };
  }

  componentDidMount() {
    fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          message: json.message,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          message: `API call failed: ${e}`,
          fetching: false
        });
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          { process.env.NODE_ENV === 'production' ?
              <p>
                Charity Watchdog, coming soon.
              </p>
            : <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
          }
          <p>
            {'« '}<strong>
              {this.state.fetching
                ? 'Fetching message from API'
                : this.state.message}
            </strong>{' »'}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
