import React, { Component } from 'react';
import Welcome from './Welcome'; 
import '../styles.css';

class App extends Component {
  render() {
    return (
      <div id="first">
        <Welcome />
      </div>
    )
  }
}

export default App;