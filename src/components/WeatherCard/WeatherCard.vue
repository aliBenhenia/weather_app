<template>
  <div class="weather-card">
    <!-- Header Section -->
    <div class="header">
      Casablanca
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
      Friday, November 8, 2024<br>9:09 PM
    </div>

    <!-- Temperature Section -->
    <div class="temperature">
      <div class="temp-left">
        <img src="https://img.icons8.com/ios/50/000000/partly-cloudy-day.png" alt="Weather Icon">
        <div class="temp-degree">{{ formattedTemperature }}</div>
      </div>
      <div class="temp-info">
        <div class="weather-description">Partly Cloudy</div>
        <div class="feels-like">Feels like: {{ formattedFeelsLike }}</div>
      </div>
    </div>

    <!-- Weather Conditions -->
    <div class="conditions">
      <div class="condition">
        <div class="condition-left">
          <img src="https://img.icons8.com/ios/50/000000/humidity.png" alt="Humidity Icon">
          <span class="condition-name">Humidity</span>
        </div>
        <div class="condition-right">
          <strong class="condition-value">40%</strong>
        </div>
      </div>
      <div class="condition">
        <div class="condition-left">
          <img src="https://img.icons8.com/ios/50/000000/wind.png" alt="Wind Icon">
          <span class="condition-name">Wind</span>
        </div>
        <div class="condition-right">
          <strong class="condition-value">{{ formattedWindSpeed }}</strong>
        </div>
      </div>
      <div class="condition">
        <div class="condition-left">
          <img src="https://img.icons8.com/ios/50/000000/rain.png" alt="Precipitation Icon">
          <span class="condition-name">Precipitation</span>
        </div>
        <div class="condition-right">
          <strong class="condition-value">15%</strong>
        </div>
      </div>
      <div class="condition">
        <div class="condition-left">
          <img src="https://img.icons8.com/ios/50/000000/air-quality.png" alt="AQI Icon">
          <span class="condition-name">AQI</span>
        </div>
        <div class="condition-right">
          <strong class="condition-value">141</strong>
        </div>
      </div>
    </div>

    <!-- AQI Section -->
    <div class="aqi">
      <div class="aqi-top">
        <span class="aqi-text">AQI</span>
        <div class="aqi-number-container">
          <span class="aqi-number">300</span>
          <i class="fas fa-exclamation-triangle aqi-icon"></i>
        </div>
      </div>
      <div class="aqi-bar-container">
        <div class="aqi-bar" style="width: 50%;"></div>
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

export default {
  data() {
    return {
      activeTab: 'hourly',
      dropdownVisible: false,
      temperatureUnit: 'C', // Default to Celsius
      measurementUnit: 'metric', // Default to Metric
      hourlyForecast: [
        { time: '9:00', icon: 'https://img.icons8.com/ios/24/000000/partly-cloudy-day.png', temp: 19 },
        { time: '10:00', icon: 'https://img.icons8.com/ios/24/000000/sun.png', temp: 21 },
        { time: '11:00', icon: 'https://img.icons8.com/ios/24/000000/partly-cloudy-day.png', temp: 22 },
        { time: '12:00', icon: 'https://img.icons8.com/ios/24/000000/rain.png', temp: 22 },
        { time: '13:00', icon: 'https://img.icons8.com/ios/24/000000/partly-cloudy-day.png', temp: 22 },
        { time: '14:00', icon: 'https://img.icons8.com/ios/24/000000/sun.png', temp: 23 },
        { time: '15:00', icon: 'https://img.icons8.com/ios/24/000000/sun.png', temp: 23 },
        { time: '16:00', icon: 'https://img.icons8.com/ios/24/000000/partly-cloudy-day.png', temp: 21 },
      ],
      dailyForecast: [
        { date: 'Mon, Nov 10', icon: 'https://img.icons8.com/ios/50/000000/partly-cloudy-day.png', temp: 22 },
        { date: 'Tue, Nov 11', icon: 'https://img.icons8.com/ios/50/000000/sun.png', temp: 24 },
        { date: 'Wed, Nov 12', icon: 'https://img.icons8.com/ios/50/000000/partly-cloudy-day.png', temp: 23 },
        { date: 'Thu, Nov 13', icon: 'https://img.icons8.com/ios/50/000000/rain.png', temp: 21 },
        { date: 'Fri, Nov 14', icon: 'https://img.icons8.com/ios/50/000000/sun.png', temp: 25 },
        { date: 'Sat, Nov 15', icon: 'https://img.icons8.com/ios/50/000000/partly-cloudy-day.png', temp: 22 },
        { date: 'Sun, Nov 16', icon: 'https://img.icons8.com/ios/50/000000/sun.png', temp: 26 },
      ],
      settingsIcon,
    };
  },
  computed: {
    formattedTemperature() {
      if (this.temperatureUnit === 'F') {
        return (this.hourlyForecast[0].temp * 9 / 5 + 32).toFixed(1); // Convert to Fahrenheit
      }
      return this.hourlyForecast[0].temp; // Celsius
    },
    formattedFeelsLike() {
      if (this.temperatureUnit === 'F') {
        return (21 * 9 / 5 + 32).toFixed(1); // Convert to Fahrenheit
      }
      return 21; // Celsius
    },
    formattedWindSpeed() {
      if (this.measurementUnit === 'imperial') {
        return (1 * 0.621371).toFixed(1) + ' mph'; // Convert km/h to mph
      }
      return '1 km/h'; // Metric
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
    }
  }
};
</script>

<style scoped src="./WeatherCard.css" >

</style>