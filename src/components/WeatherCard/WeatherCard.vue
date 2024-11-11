<template>
  <div class="weather-card">
    <div class="header">
      Casablanca
      <span class="icon-container"><img class="settings-icon" :src="settingsIcon" alt="Settings"></span>
    </div>
    <div class="date-time">
      Friday, November 8, 2024<br>9:09 PM
    </div>
    <div class="temperature">
  <div class="temp-left">
    <img src="https://img.icons8.com/ios/50/000000/partly-cloudy-day.png" alt="Weather Icon">
    <div class="temp-degree">19°</div>
  </div>
  <div class="temp-info">
    <div class="weather-description">Partly Cloudy</div>
    <div class="feels-like">
      <span>
        Feels like: 21°
      </span>
    </div>
  </div>
</div>

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
      <strong class="condition-value">1 km/h</strong>
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


    <div class="aqi">
      AQI
      <div class="aqi-bar" style="width: 50%;"></div>
      300
    </div>
    <div class="forecast-tabs">
      <div class="tab" :class="{ active: activeTab === 'hourly' }" @click="toggleTab('hourly')">Hourly Forecast</div>
      <div class="tab" :class="{ active: activeTab === 'daily' }" @click="toggleTab('daily')">7-Day Forecast</div>
    </div>
    <div class="hourly-forecast" v-if="activeTab === 'hourly'">
      <div class="hour" v-for="(hour, index) in hourlyForecast" :key="index">
        <div>{{ hour.time }}</div>
        <img :src="hour.icon" alt="Weather Icon">
        <div>{{ hour.temp }}°</div>
      </div>
    </div>
    <div class="hourly-forecast" v-if="activeTab === 'daily'">
      <div class="hour" v-for="(hour, index) in hourlyForecast" :key="index">
        <div>{{ hour.time - 1 }}</div>
        <img :src="hour.icon" alt="Weather Icon">
        <div>{{ hour.temp }}°</div>
      </div>
    </div>
    
  </div>
</template>

<script>
import settingsIcon from '@/assets/settings-4-fill.svg';
import humadityIcon from '@/assets/a.svg';
import windIcon from '@/assets/b.svg';
import precipitationIcon from '@/assets/c.svg';
import aqiIcon from '@/assets/d.svg';
export default {
  data() {
    return {
      activeTab: 'hourly',
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
      settingsIcon,
    };
  },
  methods: {
    toggleTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style  src="./WeatherCard.css"></style>