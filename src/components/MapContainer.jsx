import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

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
    button: false
  };

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

    this.setState({ button: true });

    this.setState({
      markers: [
        {
          title: "",
          name: "",
          position: { lat, lng }
        }
      ]
    });

  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true
    });

    console.log(this.state.markers[0].position)
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

  display = () => {
    console.log('in display')

    this.props.onBackButtonClick();
  }

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
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
        <div>
          <button id="back-btn" className="conditional-btn" onClick={this.props.onBackButtonClick}>Back</button>
          <button id="continue-btn" className="conditional-btn">Continue</button>
        </div>

      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(MapContainer);