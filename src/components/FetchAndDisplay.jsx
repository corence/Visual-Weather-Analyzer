//wind vane, anemometer

import React, {Component} from 'react';
import Results from './Results';
import axios from 'axios';

class FetchAndDisplay extends Component {
  constructor (props) {
    super(props);

    this.state = {
    city: this.props.city,
    countryCode: this.props.countryCode,
    showComponent: false,
    errorMsg: "",
    geoObj: {},
    selected: false,
    index: null,
    showContinueButton: false
    };
  }

  fetchLatLon = (API_KEY) => {
    //2 or 3 letter country code works
    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${this.state.city},${this.state.countryCode}&limit=5&appid=${API_KEY}`;

    axios.get(API_URL)
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
        let geoObj = {};

        res.data.forEach((value, index) => {
          //if array has state key, include its value
          if (value.state) {
          geoObj[index] = [value.lat, value.lon, value.name + "," + value.state + "," + value.country];
          }
          else {
          geoObj[index] = [value.lat, value.lon, value.name + "," + value.country];
          }
        });

        this.setState({ geoObj });
        console.log(this.state.geoObj);

        //fetch forecast data
        this.fetchForecast(API_KEY);
      }
    })
    .catch(err => {
      console.log(err);

      this.setState({ errorMsg: err });
    });

    //set showComponent to true so errMsg or geoObj can be displayed on screen
    this.setState({ showComponent: true });

  }

  fetchForecast = (API_KEY) => {
    let lat, lon;

    // let time = ((Math.floor(Date.now()/1000)) - (86400 * 5));

    Object.values(this.state.geoObj).forEach(value => {
      lat = value[0];
      lon = value[1];

      //shows current/hourly data for 5 days ago
      // let API_URL = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&units=imperial&appid=${API_KEY}`;

      //predicts **daily**/hourly/minutely temps for next 7 days
      //include *exclude* as query param
      let API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;

      axios.get(API_URL)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    });
  }

  //fetchLatLon when component mounts
  componentDidMount() {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    this.fetchLatLon(API_KEY);
  }

  //When one of location button clicks, set index to value of value parameter of button in renderOptions funcion
  //Also, set showContinueButton flag to true so user can continue
  selectLocationButton = (e) => {
    let index = Number(e.target.value);
    this.setState({ index, showContinueButton: true });
  }

  //render either errorMsg if unknown location or submitted locations as buttons 
  renderOptions = () => {
    if (this.state.showComponent) {
      if (this.state.errorMsg !== "") {
        return <p>{this.state.errorMsg}</p>;
      }
      else {
        let id;
        return Object.values(this.state.geoObj).map((value, index) => {
          if (this.state.index === index) {
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
        {/* pass other weather data too */}
        {this.state.showContinueButton ? <button id="continue-btn" className="conditional-btn" onClick={() => this.props.onContinueButtonClick(this.state.index)}>Continue</button> : null}
      </div>
    )
  }
}

export default FetchAndDisplay;