// src/services/weatherService.js

const apiKey = '7c99ecd935038b5e95b2b9f833a4ce57'; // Replace with your OpenWeatherMap API key

export const fetchWeatherDataByCoordinates = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data by coordinates:', error);
    throw error;
  }
};

export const fetchWeatherDataByCity = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data by city:', error);
    throw error;
  }
};