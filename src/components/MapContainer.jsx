import React, { Component } from 'react';
import Results from './Results';
import {
  fetchCurrentAndFutureForecast,
  fetchHistoricalForecast,
  fetchPollutionData
} from "../FetchForecastData.js";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';

class MapContainer extends Component {
  state = {
    markers: [
      {
        title: "The marker`s title will appear as a tooltip.",
        name: "SOMA",
        position: { lat:  20, lng: 23 }
      }
    ],
    showingInfoWindow: false,
    showingMarker: false,
    activeMarker: {},
    showContinueButton: false,
    currentData: {},
    futureData: {},
    historicalData: {},
    pollutionData: {},
    finalLocationName: "",
    id: 0,
    loaded: 0
  };

  // on map click, set latLng along with other state components to work with marker
  onMapClick = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (!this.state.showingMarker) {
      this.setState({ showingMarker: true })
    }

    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }

    this.setState({
      showContinueButton: true,
      markers: [
        {
          title: "",
          name: "",
          position: { lat, lng }
        }
      ]
    });
  }

  // on marker click, actually show the marker
  onMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  //create InfoWindow lat/lng text information
  displayMarkerText = () => {
    const position = this.state.markers[0].position;
    let latLng = "";

    for (const [key, value] of Object.entries(position)) {
      latLng === "" ? latLng = `${key}: ${value}, ` : latLng += `${key}: ${value}`;
    }

    return latLng;
  }

  // get final location name by reverse geolocating
  getFinalLocationName = async (API_KEY, lat, lon) => {
    const API_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    let finalLocationName;

    await axios.get(API_URL)
    .then(res => {
      // located in a state
      if (res.data[0].state) {
        finalLocationName = `${res.data[0].name},${res.data[0].state},${res.data[0].country}`;
      }
      // not located in a state
      else {
        finalLocationName = `${res.data[0].name},${res.data[0].country}`;
      }

      this.setState({ finalLocationName })
    })
    .catch(err => {
      console.log(err);
    });
  }

  // when continue button clicked, get lat, lon and fetch forecasts + final location name
  onContinueButtonClick = async () => {
    this.setState({ loaded: 1});

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    let lat = this.state.markers[0].position.lat.toFixed(2);
    let lon = this.state.markers[0].position.lng.toFixed(2);

    let [currentData, futureData] = await fetchCurrentAndFutureForecast(API_KEY, lat, lon);
    let historicalData = await fetchHistoricalForecast(API_KEY, lat, lon)
    let pollutionData = await fetchPollutionData(API_KEY, lat, lon);
    
    await this.setState({ currentData, futureData, historicalData, pollutionData, id: 1});
    
    let dataObj = {
      current: this.state.currentData,
      historical: this.state.historicalData,
      future: this.state.futureData,
      pollution: this.state.pollutionData
    };
    
    await this.getFinalLocationName(API_KEY, lat, lon);
    console.log("data for " + this.state.finalLocationName, dataObj);
  }

  // function to display page
  displaySearchPage = () => {
    if (!this.props.loaded || this.state.loaded) {
      return <p style={{fontSize: 50}}>Loading...</p>;
    }

    return (
      <div>
        <div>
          <Map
            google={this.props.google}
            style={{ width: "80%", margin: "2em 11em 10em" }}
            zoom={2}
            initialCenter={this.state.markers[0].position}z
            center={this.state.markers[0].position}
            onClick={this.onMapClick}
          >
            {this.state.markers.map((marker, index) => (
              <Marker
                key={index}
                title={marker.title}
                name={marker.name}
                position={marker.position}
                onClick={this.onMarkerClick}
                visible={this.state.showingMarker}
              />
            ))}

              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <div>
                  <h4>
                    {this.displayMarkerText()}
                  </h4>
                </div>
              </InfoWindow>
          </Map>
        </div>
        <button id="back-btn" className="conditional-btn" onClick={this.props.onBackButtonClick}>Back</button>
        {this.state.showContinueButton ? <button id="continue-btn" className="conditional-btn" onClick={this.onContinueButtonClick}>Continue</button> : null}
      </div>
    );
  }

  render() {
    return (
      <div>
        {
        !this.state.id 
        ? this.displaySearchPage() 
        : <Results 
            name={this.state.finalLocationName} 
            currentData={this.state.currentData} 
            futureData={this.state.futureData} 
            historicalData={this.state.historicalData}
            pollutionData={this.state.pollutionData}
            returnHome={this.props.onBackButtonClick}
          />
        }
    </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(MapContainer);