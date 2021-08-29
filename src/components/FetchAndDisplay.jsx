//wind vane, anemometer

import React, {Component} from 'react';
import axios from 'axios';

class FetchAndDisplay extends Component {
  constructor (props) {
    super(props);

    this.state = {
    city: this.props.city,
    countryCode: this.props.countryCode,
    showComponent: false,
    errorMsg: "",
    geolocationObject: {},
    currentData: {},
    futureData: {},
    historicalData: {},
    finalLocationName: "",
    locationIndex: null,
    showContinueButton: false
    };
  }

  //fetchLatLon when component mounts
  componentDidMount() {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    this.fetchLatLon(API_KEY);
  }

  //fetch latitude and longitude for all possible locations from form input on each input
  fetchLatLon = async (API_KEY) => {
    //2 or 3 letter country code works
    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${this.state.city},${this.state.countryCode}&limit=5&appid=${API_KEY}`;

    await axios.get(API_URL)
    .then(res => {
      //no location found
      if (res.data.length === 0) {
        const errorMsg = "ERROR, correct input syntax, but location entered does not exist\nOR\nincorrect country code (use Alpha-2 or Alpha-3 code)";
        console.log(errorMsg);

        this.setState({ errorMsg });
      }
      //location found
      else
      {
        let geolocationObject = {};

        res.data.forEach((value, index) => {
          //if array has state key, include its value
          if (value.state) {
          geolocationObject[index] = [value.lat, value.lon, value.name + "," + value.state + "," + value.country];
          }
          else {
          geolocationObject[index] = [value.lat, value.lon, value.name + "," + value.country];
          }
        });

        this.setState({ geolocationObject });
        // console.log(this.state.geolocationObject);
      }
    })
    .catch(err => {
      console.log(err);

      this.setState({ errorMsg: err });
    });

    //set showComponent to true so errMsg or geolocationObject can be displayed on screen
    this.setState({ showComponent: true });
  }

  // fetch future forecast when continue button clicked
  fetchFutureForecast = async (API_KEY, lat, lon) => {
    let currentData, futureData;

    // predicts **daily**/hourly/minutely temps for next 7 days
    const API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;

    await axios.get(API_URL)
    .then(res => {
      currentData = res.data.current;
      futureData = res.data.daily;
    })
    .catch(err => {
      console.log(err);
    });

    this.setState({ currentData, futureData });
  }

  // fetch historical forecast when continue button clicked
  //shows current/hourly data for 5 days ago
  fetchHistoricalForecast = async (API_KEY, lat, lon) => {
    let time, API_URL;
    let historicalData = {};

    // 1-5 days
    for (let i = 1; i < 6; i++) {
      time = ((Math.floor(Date.now()/1000)) - (86400 * i+1));

      // fetches up to 5 past days forecast 
      API_URL = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&units=imperial&appid=${API_KEY}`;
      await axios.get(API_URL)
      .then(res => {
        // console.log(res);
        historicalData[i-1] = res.data.current;
      })
      .catch(err => {
        console.log(err);
      })
    }

    this.setState({ historicalData });
  }

  //when continue button clicked, get lat, lon and fetch future and historical forecast
  onContinueButtonClick = async () => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    let latLonArray = Object.values(this.state.geolocationObject);
    let lat = latLonArray[this.state.locationIndex][0];
    let lon = latLonArray[this.state.locationIndex][1];

    await this.fetchFutureForecast(API_KEY, lat, lon);
    await this.fetchHistoricalForecast(API_KEY, lat, lon);
    
    console.log("current data for " + this.state.finalLocationName, this.state.currentData);
    console.log("historical data for " + this.state.finalLocationName, this.state.historicalData);
    console.log("future data for " + this.state.finalLocationName, this.state.futureData);
    // pass data to parent function to change flag (send to result screen)
    this.props.onContinue(this.state.locationIndex, this.state.finalLocationName, this.state.currentData, this.state.futureData, this.state.historicalData);
  }

  //When one of location button clicks set index, finalLocationName, and showContinueButton
  selectLocationButton = (e) => {
    let locationIndex = Number(e.target.value);
    let finalLocationName = e.target.innerHTML;
    this.setState({ 
      locationIndex, 
      finalLocationName,
      showContinueButton: true 
    });
  }

  //render either errorMsg if unknown location or submitted locations as buttons 
  renderOptions = () => {
    if (this.state.showComponent) {
      if (this.state.errorMsg !== "") {
        return <p>{this.state.errorMsg}</p>;
      }
      else {
        let id;
        return Object.values(this.state.geolocationObject).map((value, index) => {
          if (this.state.locationIndex === index) {
            id = "location-btn-selected";
          }
          else {
            id = null;
          }
          // return <button key={index} className="location-btn" onClick={this.selectLocationButton}>{value[2]}</button>;
          return <button key={index} value={index} className="location-btn" id={id} onClick={this.selectLocationButton}>{value[2]}</button>;
        });
      }
    }
  }

  render() {
    return (
      <div id="locations-div">
        {this.renderOptions()}
        {this.state.showContinueButton ? <button id="continue-btn" className="conditional-btn" onClick={this.onContinueButtonClick}>Continue</button> : null}
      </div>
    )
  }
}

export default FetchAndDisplay;