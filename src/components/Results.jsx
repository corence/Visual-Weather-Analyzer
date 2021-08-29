import React, { Component } from 'react';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from 'recharts';

export class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      currentData: this.props.currentData,
      futureData: this.props.futureData,
      historicalData: this.props.historicalData,
      map: "",
      index: 0,
      // slides: [this.fetchHistoricalChart(), this.fetchFutureChart(), this.fetchBarChart()]
    }
  }

  //round to 2 decimal places (used for bar chart averages)
  round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  //future historical chart
  fetchHistoricalChart = () => {
    const data = [];

    Object.values(this.state.historicalData).forEach((value, index) => {
      data.push(
        {
          name: index+1,
          temp: value.temp
        }
      );
    });

    // for (let i = 1; i <= 5; i++) {
    //   data.push(
    //     {
    //       name: i,
    //       temp: 50+i
    //     }
    //   );
    // }

    return (
      <ResponsiveContainer className="chart-container" width="100%" height={500}>
        <LineChart stroke="#000000" data={data} margin={{ bottom: 5}}>
          <CartesianGrid stroke="#000000" strokeDasharray="3 3" />
          <XAxis stroke="#000000" dataKey="name">
            <Label value="time preceding today (days)" offset={-2} position="insideBottom" />
          </XAxis>
          <YAxis
          stroke="#000000"
          label={{ value: "temperature (\u00b0F)", angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          {/* <Legend wrapperStyle={{ position: "relative" }}/> */}
          <Line type="monotone" dataKey="temp" stroke="#8A2BE2" dot={{ r: 4 }} activeDot={{ r: 8 }}/>
        </LineChart>
      </ResponsiveContainer>
    );
  }

  //future line chart
  fetchFutureChart = () => {
    const data = [];

    for (let i = 1; i <= 5; i++) {
      data.push(
        {
          name: i,
          temp: this.state.futureData[i].temp.day
          // temp: 50+i
        }
      );
    }

    return (
      <ResponsiveContainer className="chart-container" width="100%" height={500}>
      {/* <ResponsiveContainer className="chart-container"> */}
        <LineChart stroke="#000000" data={data}>
          <CartesianGrid stroke="#000000" strokeDasharray="3 3" />
          <XAxis stroke="#000000" dataKey="name">
            <Label value="time succeeding today (days)" offset={-2} position="insideBottom" />
          </XAxis>
          <YAxis
          stroke="#000000"
          label={{ value: "temperature (\u00b0F)", angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          {/* <Legend wrapperStyle={{ position: "relative" }}/> */}
          <Line type="monotone" dataKey="temp" stroke="#8A2BE2" dot={{ r: 4 }} activeDot={{ r: 8 }}/>
        </LineChart>
      </ResponsiveContainer>
    );
  }

  //bar chart (5 day preceding average vs today vs 5 day succeeding average) temperatures
  fetchBarChart = () => {
    let data = [];
    let historicalDataAvg = 0, futureDataAvg = 0; 
    let currentData, historicalData, futureData = {};

    //historical data
    Object.values(this.state.historicalData).forEach(value => {
      historicalDataAvg = historicalDataAvg + value.temp;
    });
    
    //future data
    for (let i = 1; i <= 5; i++) {
      futureDataAvg += this.state.futureData[i].temp.day;
    }
    
    historicalDataAvg = this.round((historicalDataAvg / 5), 2);
    futureDataAvg = this.round((futureDataAvg / 5), 2);

    currentData = {
      name: "today",
      temp: this.state.currentData.temp,
      // temp: 60,
      color: "#483D8B"
    };

    historicalData = {
      name: "5 preceding day average",
      temp: historicalDataAvg,
      // temp: 50,
      color: "#DC143C"
    };
  
    futureData = {
      name: "5 succeeding day average",
      temp: futureDataAvg,
      // temp: 100,
      color: "#DAA520"
    };

    data.push( historicalData, currentData, futureData);

    return (
      <div>
        <ResponsiveContainer className="chart-container" width="100%" height={500}>
          <BarChart data={data} margin={{top: 30}}>
            <XAxis dataKey="name" fontFamily="sans-serif" fontSize="25" tickSize dy="25" stroke="#000000"/>
            <YAxis hide />
            <Bar
              dataKey="temp"
              barSize={170}
              fontFamily="sans-serif"
              label={<CustomizedLabel />}
              >
              {data.map((entry, index) => (
              <Cell key={index} fill={data[index].color} />
              ))}
            </Bar>
          </BarChart>
        </ ResponsiveContainer>
      </div>
    );
  }

  getBarYAxisLabel = () => {
    return (
      <div className="side-text">
        <p>Temperature (&deg;F)</p>
      </div>
    )
  }

  render() {
    const slides = [this.fetchHistoricalChart(), this.fetchFutureChart(), this.fetchBarChart()]

    return (
      <div>
        <span id="title">Results</span>
        {this.state.index === 2 ? this.getBarYAxisLabel() : null}
        <div className="slideshow">
          <div 
            className="slideshowSlider"
            style={{ transform: `translate3d(${-this.state.index * 100}%, 0, 0)` }}
          >
            {/* {this.state.slides.map((slideFunction, index) => ( */}
            {slides.map((slideFunction, index) => (
              <div className="slide" key={index}>{slideFunction}</div>
            ))}
          </div>
       </div>

       <div className="slideshowDots">
        {/* {this.state.slides.map((_, idx) => ( */}
        {slides.map((_, idx) => (
          <div 
          key={idx} 
          className={`slideshowDot${this.state.index === idx ? " active" : ""}`}
          onClick={() => this.setState({index: idx})
        }
          >
          </div>
        ))}
      </div>

        <button id="home-btn" className="conditional-btn" onClick={this.props.returnHome}>Homepage</button>
      </div>
    );
  }
}

//customized label used in bar chart
class CustomizedLabel extends Component {
  render() {
    const { x, y, fill, value } = this.props;
    return (
      <text
        x={x}
        y={y}
        dy={-10}
        dx={85}
        fontSize="25"
        fontFamily="sans-serif"
        fill={fill}
        textAnchor="middle"
      >
        {value}
      </text>
    );
  }
}

export default Results;

// light blue background

// 1st slide --> 
// big current temp, humidity, uvi(uv index)  
// -gif/image of weather taking up whole screen background

// 2nd slide --> 3 line graph w/ current temp, average of past 5 days current temp, average of next 7 days temp (not including present)
// -historical vs future vs present

// bar chart averages of past 5 day, current temp, 5 day in advance

// 3rd slide --> pi chart w/ air pollution?

// only look at weather[0]
// thunderstorm
// drizzle
// rain
// snow
// atmosphere --> mist, smoke, haze, dust, fog, sand, ash, squall, tornado
// clear
// clouds
