<template>
  <div class="weather-card">
    <!-- Header Section -->
    <div class="header">
      {{ cityName }}
      <span class="icon-container" @click="toggleDropdown">
        <img class="settings-icon" :src="settingsIcon" alt="Settings">
      </span>
    </div>

    <!-- Dropdown for Settings -->
    <transition name="fade">
      <div v-if="dropdownVisible" class="settings-dropdown">
        <div class="dropdown-block">
          <div class="block-header">Temperature</div>
          <div class="tabs">
            <div 
              class="tab" 
              :class="{ active: temperatureUnit === 'C' }" 
              @click="updateTemperatureUnit('C')">°C</div>
            <div 
              class="tab" 
              :class="{ active: temperatureUnit === 'F' }" 
              @click="updateTemperatureUnit('F')">°F</div>
          </div>
        </div>

        <div class="dropdown-block">
          <div class="block-header">Measurement</div>
          <div class="tabs">
            <div 
              class="tab" 
              :class="{ active: measurementUnit === 'metric' }" 
              @click="updateMeasurementUnit('metric')">Metric</div>
            <div 
              class="tab" 
              :class="{ active: measurementUnit === 'imperial' }" 
              @click="updateMeasurementUnit('imperial')">Imperial</div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Date and Time -->
    <div class="date-time">
      {{ currentDateTime }}
    </div>

    <!-- Temperature Section -->
    <div class="temperature">
      <div class="temp-left">
        <img :src="weatherIcon" alt="Weather Icon">
        <div class="temp-degree">{{ formattedTemperature }}</div>
      </div>
      <div class="temp-info">
        <div class="weather-description">{{ weatherDescription }}</div>
        <div class="feels-like">Feels like: {{ formattedFeelsLike }}</div>
      </div>
    </div>

    <!-- Weather Conditions -->
    <div class="conditions">
      <div class="condition" v-for="(condition, index) in weatherConditions" :key="index">
        <div class="condition-left">
          <img :src="condition.icon" :alt="condition.name + ' Icon'">
          <span class="condition-name">{{ condition.name }}</span>
        </div>
        <div class="condition-right">
          <strong class="condition-value">{{ condition.value }}</strong>
        </div>
      </div>
    </div>

    <!-- AQI Section -->
    <div class="aqi">
      <div class="aqi-top">
        <span class="aqi-text">AQI</span>
        <div class="aqi-number-container">
          <span class="aqi-number">{{ aqi }}</span>
          <i class="fas fa-exclamation-triangle aqi-icon"></i>
        </div>
      </div>
      <div class="aqi-bar-container">
        <div class="aqi-bar" :style="{ width: aqiPercentage + '%' }"></div>
      </div>
    </div>

    <!-- Forecast Tabs -->
    <div class="forecast-tabs">
      <div class="tab" :class="{ active: activeTab === 'hourly' }" @click="toggleTab('hourly')">Hourly Forecast</div>
      <div class="tab" :class="{ active: activeTab === 'daily' }" @click="toggleTab('daily')">7-Day Forecast</div>
    </div>

    <!-- Hourly and Daily Forecast -->
    <div class="forecast-content">
      <div class="hourly-forecast" v-if="activeTab === 'hourly'">
        <div class="hour" v-for="(hour, index) in hourlyForecast" :key="index">
          <div>{{ hour.time }}</div>
          <img :src="hour.icon" alt="Weather Icon">
          <div>{{ hour.temp }}°</div>
        </div>
      </div>
      <div class="daily-forecast" v-if="activeTab === 'daily'">
        <div class="day" v-for="(day, index) in dailyForecast" :key="index">
          <div>{{ day.date }}</div>
          <img :src="day.icon" alt="Weather Icon">
          <div>{{ day.temp }}°</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import settingsIcon from '@/assets/settings-4-fill.svg';
import { fetchWeatherDataByCoordinates, fetchWeatherDataByCity } from '@/services/weatherService';

export default {
  data() {
    return {
      cityName: 'London', // Default to London
      activeTab: 'hourly',
      dropdownVisible: false,
      temperatureUnit: 'C', // Default to Celsius
      measurementUnit: 'metric', // Default to Metric
      hourlyForecast: [],
      dailyForecast: [],
      weatherConditions: [],
      weatherIcon: '',
      weatherDescription: '',
      aqi: 0,
      aqiPercentage: 0,
      settingsIcon,
      lat: null,
      lon: null,
    };
  },
  computed: {
    formattedTemperature() {
      const temp = this.temperatureUnit === 'F'
        ? (this.hourlyForecast[0]?.temp * 9 / 5 + 32).toFixed(1)
        : this.hourlyForecast[0]?.temp;
      return temp || 'N/A';
    },
    formattedFeelsLike() {
      const feelsLike = this.temperatureUnit === 'F'
        ? (this.hourlyForecast[0]?.feels_like * 9 / 5 + 32).toFixed(1)
        : this.hourlyForecast[0]?.feels_like;
      return feelsLike || 'N/A';
    },
    currentDateTime() {
      return new Date().toLocaleString(); // Adjust format as needed
    }
  },
  methods: {
    toggleTab(tab) {
      this.activeTab = tab;
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    updateTemperatureUnit(unit) {
      this.temperatureUnit = unit;
    },
    updateMeasurementUnit(unit) {
      this.measurementUnit = unit;
    },
    getLocation() {
      const storedLat = localStorage.getItem('lat');
      const storedLon = localStorage.getItem('lon');

      if (storedLat && storedLon) {
        this.lat = parseFloat(storedLat);
        this.lon = parseFloat(storedLon);
        this.fetchWeatherData(this.lat, this.lon);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            localStorage.setItem('lat', this.lat);
            localStorage.setItem('lon', this.lon);
            this.fetchWeatherData(this.lat, this.lon);
          },
          error => {
            console.error('Geolocation error:', error);
            this.fetchWeatherDataByCity(this.cityName); // Fallback to London
          }
        );
      } else {
        console.error('Geolocation not supported');
        this.fetchWeatherDataByCity(this.cityName); // Fallback to London
      }
    },
    async fetchWeatherData(lat, lon) {
      try {
        const data = await fetchWeatherDataByCoordinates(lat, lon);
        this.updateWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    },
    async fetchWeatherDataByCity(city) {
      try {
        const data = await fetchWeatherDataByCity(city);
        this.updateWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data by city:', error);
      }
    },
    updateWeatherData(data) {
      this.cityName = data.name;
      this.weatherDescription = data.weather[0].description;
      this.weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      
      // Fake hourly forecast data
      this.hourlyForecast = [
        { time: 'Now', temp: data.main.temp, feels_like: data.main.feels_like, icon: this.weatherIcon },
        { time: '1 PM', temp: data.main.temp + 1, icon: this.weatherIcon },
        { time: '2 PM', temp: data.main.temp + 2, icon: this.weatherIcon },
        { time: '3 PM', temp: data.main.temp + 3, icon: this.weatherIcon },
      ];

      // Fake daily forecast data
      this.dailyForecast = [
        { date: 'Tomorrow', temp: data.main.temp + 2, icon: this.weatherIcon },
        { date: 'Day 3', temp: data.main.temp + 3, icon: this.weatherIcon },
        { date: 'Day 4', temp: data.main.temp + 1, icon: this.weatherIcon },
        { date: 'Day 5', temp: data.main.temp, icon: this.weatherIcon },
      ];

      this.weatherConditions = [
        { name: 'Humidity', value: `${data.main.humidity}%`, icon: 'https://img.icons8.com/ios/50/000000/humidity.png' },
        { name: 'Wind', value: `${data.wind.speed} m/s`, icon: 'https://img.icons8.com/ios/50/000000/wind.png' },
        { name: 'Precipitation', value: '15%', icon: 'https://img.icons8.com/ios/50/000000/rain.png' },
        { name: 'AQI', value: this.aqi, icon: 'https://img.icons8.com/ios/50/000000/air-quality.png' }
      ];

      // Placeholder for AQI data
      this.aqi = 300; // Update with actual AQI data if available
      this.aqiPercentage = Math.min(this.aqi / 500 * 100, 100); // Example calculation for AQI bar
    },
  },

  mounted() {
    this.getLocation();
  }
};
</script>

<style scoped src="./WeatherCard.css"></style>