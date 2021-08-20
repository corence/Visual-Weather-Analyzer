import React, { Component } from 'react';
import MyForm from './MyForm';
import MapContainer from './MapContainer';

export class Welcome extends Component {
    state = {
      id: 0,
      showComponent: true
    };

  // renders in component based off id value
  renderComponent = () => {
    if (this.state.id === 1) {
      return <MyForm onBackButtonClick={this.resetID} />;
    }
    
    if (this.state.id === 2) {
      return <MapContainer onBackButtonClick={this.resetID} />;
    }
  }

  // sets value of id based off which div clicked (Search/Map)
  setID = (value) => {
    this.setState({ id: value });
  }

  // called in child class to return to Welcome page
  resetID = () => {
    this.setState({ id: 0 });
  }

  newPage = () => {
    this.setState({ page: 0 })
  }

  // contains jsx for Welcome page
  displayWelcomePage = () => {
    return (
      <div>
        <span id="title">Visual Weather Analyzer</span>
        <div className="container">
          <div id="search-div" className="col" onClick={() => this.setID(1)}>
            <span className="main-word">Search</span>
            <p>Analyze the weather of the location of your choice through a simple search!</p>
            <ul>
              <li>Enter the city you want to get weather data for</li>
              <li>Upon search, 1-5 clickable locations will render</li>
              <li>Click your desired location in order to continue</li>
            </ul>
            <p>Looking for a more specific search? Use the following format: <br /> {"{"}city name{"}"},{"{"}country code{"}"}</p>
            <p>
              See this link <a href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes" target="_blank" rel="noreferrer">Country Codes</a>
              &nbsp;for list of country codes <br /> (use Alpha-2 or Alpha-3 code)
            </p>
          </div>
          <div id="map-div" className="col" onClick={() => this.setID(2)}>
            <span className="main-word">Map</span>
            <p>Analyze the weather of the location of your choice through google maps!</p>
            <ul>
              <li>Click and drag to navigate through the map</li>
              <li>Scroll up or down on your mouse to zoom in and out</li>
              <li>Click to create a marker that reveals the coordinates of that location</li>
            </ul>
            <p>Continue this process until you have clicked your final location</p>
            <p>Press the "CONTINUE" button at the bottom of the screen to use your current marked location to analyze the weather!</p>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {!this.state.id ? this.displayWelcomePage() : this.renderComponent()}
      </div>
    )
  }
}

export default Welcome;