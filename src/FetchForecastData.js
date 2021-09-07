import axios from 'axios';

// fetch current AND future forecast when continue button clicked
export const fetchCurrentAndFutureForecast = async (API_KEY, lat, lon) => {
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

  return [currentData, futureData];
}

// fetch historical forecast when continue button clicked
//shows current/hourly data for 5 days ago
export const fetchHistoricalForecast = async (API_KEY, lat, lon) => {
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
    });
  }

  return historicalData;
}

// fetches air pollution data    
export const fetchPollutionData = async (API_KEY, lat, lon) => {
  let pollutionData;
  const API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  await axios.get(API_URL)
  .then(res => {
    // console.log(res);
    pollutionData = res.data.list[0];
  })
  .catch(err => {
    console.log(err);
  });

  return pollutionData;
}