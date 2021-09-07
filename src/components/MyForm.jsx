import React, { Component } from 'react';
import DisplaySearch from './DisplaySearch';
import Results from './Results';

class MyForm extends Component {
  state = {
    input: "",
    error: false,
    errorMsg: "",
    showComponent: false,
    locationIndex: null,
    id: 0,
    currentData: {},
    futureData: {},
    historicalData: {},
    pollutionData: {},
    finalLocationName: ""
  };

  //handle text box change
  handleChange = (event) => {
    this.setState({ input: event.target.value, showComponent: false, errorMsg: "" });
  }

  //handle submit button click
  handleSubmit = async (event) => {
    event.preventDefault();

    await this.validateForm();
  }

  //validate textbox input
  validateForm = () => {
    var error = false;
    var errorMsg = "";
    var showComponent = false;

    //empty/blank field
    if ((this.state.input.length === 0) || (!(/\S/.test(this.state.input)))) {
      error = true;
      errorMsg = "ERROR! Empty or blank field!";
    }
    //field has input
    else {
      //input field includes an integer
      if (/\d/.test(this.state.input)) {
        error = true;
        // errorMsg += "ERROR! Don't include numbers in input!";
        errorMsg === "" ? errorMsg = "ERROR! Don't include numbers in input!" : errorMsg += "\nERROR! Don't include numbers in input!";
      }

      const format = /[`!@#$%^&*()_+\-=\]{};':"\\|<>?~]/;
      // input field includes special characters
      if (format.test(this.state.input)) {
        error = true;
        errorMsg === "" ? errorMsg = "ERROR! Don't include special characters in input!" : errorMsg += "\nERROR! Don't include special characters in input!";
      }

      const commaPosition = this.state.input.indexOf(",");
      //input field does include comma, check for characters before or after
      if (commaPosition >= 0) {
        //comma only input
        if ((commaPosition === 0) && (commaPosition === (this.state.input.length - 1))) {
          error = true;
          errorMsg === "" ? errorMsg = "ERROR! Comma can't be the only character inputted!" : errorMsg += "\nERROR! Comma can't be the only character inputted!";
        }
        //comma at first position of input
        else if (commaPosition === 0) {
          error = true;
          errorMsg === "" ? errorMsg = "ERROR! Comma can't be at first position of input!" : errorMsg += "\nERROR! Comma can't be at first position of input!";
        }
        //comma at last position of input
        else if (commaPosition === (this.state.input.length - 1)) {
          error = true;
          errorMsg === "" ? errorMsg = "ERROR! Comma can't be at last position of input!" : errorMsg += "\nERROR! Comma can't be at last position of input!";
        }
      }
    }

    //no error, show component
    if (!error) {
      showComponent = true;
    }

    this.setState({ showComponent, error, errorMsg });
  }

  //get city, country code by parsing input
  getProps = () => {
    const commaPosition = this.state.input.indexOf(",");
    var city, countryCode;

    if (commaPosition > 0) {
      city = this.state.input.substring(0, commaPosition);
      countryCode = this.state.input.substring(commaPosition + 1, this.state.input.length);
    }
    else {
      city = this.state.input.substring(0, this.state.input.length);
      countryCode = "";
    }

    return [city, countryCode];
  } 

  //if no error, try to render
  renderSearchInfo = () => {
    const [city, countryCode] = this.getProps();
    return <DisplaySearch city={city} countryCode={countryCode} onContinue={this.continue}/>;
  }

  // set the state of all the data, including id to 1 in order to render Results component
  continue = (locationIndex, currentData, futureData, historicalData, pollutionData) => {
    if (locationIndex !== this.state.locationIndex) {
      this.setState({ 
        id: 1,
        locationIndex,
        currentData,
        futureData,
        historicalData,
        pollutionData
      });
    }
  }

  // function to display page
  displaySearchPage = () => {
    return (
      <div id="form-div">
        <div>
          <form onSubmit={this.handleSubmit}>
            <input id="text-entry" type="text" placeholder="Enter location..." value={this.state.value} onChange={this.handleChange} />
            <br />
            <input id="text-entry-btn" type="submit" value="SUBMIT" />
          </form>
          {this.state.showComponent ? this.renderSearchInfo() : <p>{this.state.errorMsg}</p>}
        </div>
        <button id="back-btn" className="conditional-btn" onClick={this.props.onBackButtonClick}>Back</button>
      </div>
    )
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

export default MyForm;