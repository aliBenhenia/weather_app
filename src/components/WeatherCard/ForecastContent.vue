<template>
    <div class="forecast-content" :class="activeTab">
      <!-- Hourly Forecast Tab -->
      <div v-if="activeTab === 'hourly'" class="forecast-scroll">
        <div v-for="(hour, index) in hourlyForecast" :key="index" class="forecast-item">
          <span class="forecast-time">{{ hour.time }}</span>
          <i :class="hour.icon"></i>
          <span class="forecast-temp">{{ hour.temp }}°</span>
        </div>
      </div>
  
      <!-- Daily Forecast Tab -->
      <div v-if="activeTab === 'daily'" class="forecast-scroll">
        <div v-for="(day, index) in dailyForecast" :key="index" class="forecast-item">
          <span class="forecast-day">{{ day.date }}</span>
          <i :class="day.icon"></i>
          <span class="forecast-temp">{{ day.temp }}°</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ForecastContent',
    props: {
      activeTab: {
        type: String,
        required: true
      },
      hourlyForecast: {
        type: Array,
        required: true
      },
      dailyForecast: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  