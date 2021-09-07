import React, {Component} from 'react';
import axios from 'axios';
import {
  fetchCurrentAndFutureForecast,
  fetchHistoricalForecast,
  fetchPollutionData
} from "../FetchForecastData.js";;

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
    pollutionData: {},
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

  //when continue button clicked, get lat, lon and forecasts
  onContinueButtonClick = async () => {
    this.setState({ errorMsg: "Loading..."});

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    let latLonArray = Object.values(this.state.geolocationObject);
    let lat = latLonArray[this.state.locationIndex][0];
    let lon = latLonArray[this.state.locationIndex][1];

    let [currentData, futureData] = await fetchCurrentAndFutureForecast(API_KEY, lat, lon);
    let historicalData = await fetchHistoricalForecast(API_KEY, lat, lon)
    let pollutionData = await fetchPollutionData(API_KEY, lat, lon);
    
    await this.setState({ currentData, futureData, historicalData, pollutionData })

    let dataObj = {
      current: this.state.currentData,
      historical: this.state.historicalData,
      future: this.state.futureData,
      pollution: this.state.pollutionData
    };
    
    console.log("data for " + this.state.finalLocationName, dataObj);

    // pass data to parent function to change flag (send to result screen)
    this.props.onContinue(
      this.state.locationIndex, 
      this.state.finalLocationName, 
      this.state.currentData, 
      this.state.futureData, 
      this.state.historicalData, 
      this.state.pollutionData
    );
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