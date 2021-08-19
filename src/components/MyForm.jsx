import React, { Component } from 'react';
import FetchAndDisplay from './FetchAndDisplay';

class MyForm extends Component {
  state = {
    input: "",
    error: false,
    errorMsg: "",
    showComponent: false,
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
  renderFD = () => {
    const [city, countryCode] = this.getProps();
    return <FetchAndDisplay city={city} countryCode={countryCode}/>;
  }

  render() {
    return (
      <div id="form-div">
        <div>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <input type="submit" value="Submit" />
          </form>
          {this.state.showComponent ? this.renderFD() : <p>{this.state.errorMsg}</p>}
        </div>
        <div>
          <button id="back-btn" className="conditional-btn" onClick={this.props.onBackButtonClick}>Back</button>
          <button id="continue-btn" className="conditional-btn">Continue</button>
        </div>

      </div>
    )
  }
}

export default MyForm;