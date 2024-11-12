import axios from 'axios';

const apiKey = '7c99ecd935038b5e95b2b9f833a4ce57'; // should be stored in .env file(here for simplicity) and used as process.env.API_KEY 

export const fetchWeatherDataByCoordinates = async (lat: number, lon: number) => {
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

export const fetchWeatherDataByCity = async (city: string) => {
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
  } catch (error: any) {
    console.error('Error fetching weather data by city:', error);
    throw error;
  }
};
