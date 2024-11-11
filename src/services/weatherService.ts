

import axios from 'axios';

const apiKey = '7c99ecd935038b5e95b2b9f833a4ce57'; 

export const fetchWeatherDataByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: apiKey,
          units: 'metric'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data by coordinates:', error);
    throw error;
  }
};

export const fetchWeatherDataByCity = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data by city:', error);
    throw error;
  }
};
