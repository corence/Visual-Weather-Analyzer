import React, { Component } from 'react';
import { 
  LineChart, Line, 
  BarChart, Bar, 
  PieChart, Pie, Sector,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer
} from 'recharts';

export class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: this.props.currentData,
      futureData: this.props.futureData,
      historicalData: this.props.historicalData,
      pollutionData: this.props.pollutionData,
      slideIndex: 0,
      activePieIndex: 0,
      fahrenheitFlag: 0,
      celsiusFlag: 1,
      tempAfterConversion: "",
      unitAfterConversion: "",
      backgroundImage: ""
    }
  }

  // check weather object in openweatherapi docs against returned weather description to display correct background image 
  getBackgroundImage = () => {
    let backgroundImage = "";
    let weatherObject = {
      "Thunderstorm": "https://static01.nyt.com/images/2020/02/06/climate/06CLI-LIGHTNING/06CLI-LIGHTNING-superJumbo.jpg",
      "Drizzle": "https://cdn.pixabay.com/photo/2015/08/03/22/25/rain-874041_960_720.jpg",
      "Rain": "https://static.temblor.net/wp-content/uploads/2017/03/rain.jpg",
      "Snow": "https://static.scientificamerican.com/sciam/cache/file/391E7BCB-431B-41EB-B8A85786A27DFAC6_source.jpg",
      "Clear": "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/summer-field-over-blue-clear-sky-da-kuk.jpg",
      "Clouds": "https://upload.wikimedia.org/wikipedia/commons/7/73/Cloudy_sky_%2826171935906%29.jpg",
      "Mist": "https://www.advancednanotechnologies.com/wp-content/uploads/2019/05/iStock-1055906130-1080x675.jpg",
      "Smoke": "https://media.wired.com/photos/5b8473dacde746582fe9ff00/master/pass/smokestorm-1021620844.jpg",
      "Haze": "https://cff2.earth.com/uploads/2018/11/13015448/what-is-haze.jpg",
      "Dust": "https://metofficenews.files.wordpress.com/2012/10/dust-storm.jpg",
      "Fog": "https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/weather/fog--mist/foggy-morning-in-a-meadow.jpg",
      "Sand": "https://media.defense.gov/2018/Jul/03/2001938790/-1/-1/0/180624-F-XX000-0004.JPG",
      "Ash": "https://ca-times.brightspotcdn.com/dims4/default/00b57cb/2147483647/strip/true/crop/5438x3466+0+0/resize/1486x947!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F2e%2F1c%2Fc686cacd4974b3c146e96ea74b11%2Fla-photos-1staff-609179-me-0909-bobcat-fire4-wjs.jpg",
      "Squall": "https://i.pinimg.com/originals/a9/c5/30/a9c5302c7afd27f7ac3bb6c089024839.jpg",
      "Tornado": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/F5_tornado_Elie_Manitoba_2007.jpg/1200px-F5_tornado_Elie_Manitoba_2007.jpg"
    };

    let weatherDescription = this.state.currentData.weather[0].main;
    Object.entries(weatherObject).forEach(value => {
      if (weatherDescription === value[0]) {
        backgroundImage = value[1];   
      }
    });

    return backgroundImage;
  }

  //round to 2 decimal places (used for bar chart averages)
  round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  // decide whether to convert from F to C, vice versa, or neither
  convert = (units) => {
    let tempAfterConversion, unitAfterConversion;

    // celsius to fahrenheit
    if (units === 0) {
      if (this.state.fahrenheitFlag !== 0) {
        tempAfterConversion = ((this.state.tempAfterConversion * (9/5)) + 32).toFixed(2);
        unitAfterConversion = "\u00b0F";

        this.setState({ tempAfterConversion, unitAfterConversion, fahrenheitFlag: 0, celsiusFlag: 1});
        return;
      }
    }
    
    // fahrenheit to celsius
    if (units === 1) {
      if (this.state.celsiusFlag !== 0) {
        tempAfterConversion = ((this.state.currentData.temp - 32) * (5/9)).toFixed(2);
        unitAfterConversion = "\u00b0C";

        this.setState({ tempAfterConversion, unitAfterConversion, fahrenheitFlag: 1, celsiusFlag: 0 });
      }
    }
  }

  //fetch basic forecast data (all 1st slide data)
  fetchBasicForecastSlide = () => {
    let displayedTemp, displayedUnit;

    if (this.state.tempAfterConversion === "") {
      displayedTemp = this.state.currentData.temp;
      displayedUnit = "\u00b0F";
    }
    else {
      displayedTemp = this.state.tempAfterConversion;
      displayedUnit = this.state.unitAfterConversion;
    }

    return (
      <div className="current-temp-slide" style={{ backgroundColor: "white" }}>
        <div className="half-temp-slide">
          <div className="temp-circle">
            <p id="temp-text">{displayedTemp}</p>
            <p id="unit-text">{displayedUnit}</p>
          </div>
          <div className="change-unit">
            <span className="change-unit-text" onClick={() => this.convert(0)}>{"\u00b0F"}</span>
            <span style={{fontSize: 50}}>|</span>
            <span className="change-unit-text" onClick={() => this.convert(1)}>{"\u00b0C"}</span>
          </div>
        </div>
        <div className="half-temp-slide">
          <div className="weather-description">
            <p style={{marginTop: 0, marginBottom: 0}}>{"Weather Description:"}</p>
            <p style={{marginTop: 10, marginBottom: 0}}>{this.state.currentData.weather[0].main}</p>
          </div>
          <div className="forecast-data">
            <p>{`Humidity: ${this.state.currentData.humidity}%`}</p>
          </div>
          <div className="forecast-data">
            <p>{`UVI: ${this.state.currentData.uvi}`}</p>
          </div>
          <div className="forecast-data">
            <p>{`AQI: ${this.state.pollutionData.main.aqi}`}</p>
          </div>
          <div className="forecast-data">
            <p>{`Wind Speed: ${this.state.currentData.wind_speed} mi/h`}</p>
          </div>
        </div>
      </div>
    );
  }

  // fetch future historical chart
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
    
    return (
      <ResponsiveContainer className="chart-container" width="100%" height={600}>
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
          <Line 
            isAnimationActive={false}
            type="monotone"
            dataKey="temp"
            stroke="#DC143C"
            strokeWidth={5}
            dot={{ r: 6 }}
            activeDot={{ r: 10 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  //fetch future line chart
  fetchFutureChart = () => {
    const data = [];

    for (let i = 1; i <= 5; i++) {
      data.push(
        {
          name: i,
          temp: this.state.futureData[i].temp.day
        }
      );
    }

    return (
      <ResponsiveContainer className="chart-container" width="100%" height={600}>
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
          <Line 
            isAnimationActive={false}
            type="monotone"
            dataKey="temp"
            stroke="#DAA520"
            strokeWidth={5}
            dot={{ r: 6 }}
            activeDot={{ r: 10 }}
          />
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
      color: "#87CEFA"
    };

    historicalData = {
      name: "5 preceding day average",
      temp: historicalDataAvg,
      color: "#DC143C"
    };
  
    futureData = {
      name: "5 succeeding day average",
      temp: futureDataAvg,
      color: "#DAA520"
    };

    data.push( historicalData, currentData, futureData);

    return (
      <ResponsiveContainer className="chart-container" width="100%" height={600}>
        <BarChart data={data} margin={{top: 30}}>
          <XAxis dataKey="name" fontFamily="sans-serif" fontSize="25" tickSize dy="25" stroke="#000000"/>
          <YAxis hide />
          <Bar
            isAnimationActive={false}
            dataKey="temp"
            barSize={170}
            fontFamily="sans-serif"
            label={<BarCustomLabel />}
          >
            {data.map((entry, index) => (
            <Cell key={index} fill={data[index].color} />
            ))}
          </Bar>
        </BarChart>
      </ ResponsiveContainer>
    );
  }

  fetchPollutionChart = () => {
    let data = [];

    // blue, crimson, gray, pink, green, purple, brown, gold
    const COLORS = ["#6495ED", "#DC143C", "#808080" ,"#FF69B4", "#006400", "#8B008B", "#8B4513" ,"#FFD700"]

    Object.entries(this.state.pollutionData.components).forEach((key, index) => {
      data.push(
        {
          name: key[0],
          value: key[1],
        }
      );
    });

    return (
      <ResponsiveContainer className="chart-container" width="100%" height={600}>
        <PieChart>
          <Pie
            isAnimationActive={false}
            activeIndex={this.state.activePieIndex}
            activeShape={<PieActiveShape />}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={200}
            outerRadius={250}
            dataKey="value"
            paddingAngle={3}
            onMouseEnter={this.onPieEnter}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // when user hovers over certain section of pie, show active index
  onPieEnter = (_, index) => {
    this.setState({
      activePieIndex: index
    });
  };

  // custom(ish) label on left of bar chart
  getBarYAxisLabel = () => {
    return (
      <div className="side-text">
        <p>Temperature (&deg;F)</p>
      </div>
    );
  }

  render() {
    const slides = [this.fetchBasicForecastSlide(), this.fetchHistoricalChart(), this.fetchFutureChart(), this.fetchBarChart(), this.fetchPollutionChart()]

    let backgroundImage = this.getBackgroundImage();
    if (backgroundImage !== "") {
      document.body.style.background = `url(${backgroundImage}) no-repeat`;
      document.body.style.backgroundSize = "cover";
    }

    return (
      <div>
        <span className="title">Results</span>
        {this.state.slideIndex === 3 ? this.getBarYAxisLabel() : null}
        <div className="slideshow">
          <div 
            className="slideshowSlider"
            style={{ transform: `translate3d(${-this.state.slideIndex * 100}%, 0, 0)` }}
          >
            {slides.map((slideFunction, index) => (
              <div className="slide" key={index} style={{backgroundColor: "white"}}>{slideFunction}</div>
            ))}
          </div>
        </div>
        <div className="slideshowDots">
          {slides.map((_, idx) => (
            <div
              key={idx} 
              className={`slideshowDot${this.state.slideIndex === idx ? " active" : ""}`}
              onClick={() => this.setState({slideIndex: idx})}
            />
          ))}
        </div>
        <button id="home-btn" className="conditional-btn" onClick={this.props.returnHome}>Homepage</button>
      </div>
    );
  }
}

//customized label used in bar chart
class BarCustomLabel extends Component {
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

//active shape to use in pie chart
class PieActiveShape extends Component {
  render() {
    const fullNames = {
      co: "Carbon monoxide",
      no: "Nitrogen monoxide",
      no2: "Nitrogen dioxide",
      o3: "Ozone",
      so2: "Sulphur dioxide",
      pm2_5: "Fine particles matter",
      pm10: "Coarse particulate matter",
      nh3: "Ammonia"
    };

    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = this.props;

    // math from props
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={-8} textAnchor="middle" fontSize={45} fill={fill}>
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={22} textAnchor="middle" fontSize={30} fill={fill}>
          {Object.entries(fullNames).map(key => {
            return (payload.name === key[0] ? `(${key[1]})` : null)
          })}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} \u03BCg/m^3`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  }
}

export default Results;