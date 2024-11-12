<template>
    <div class="aqi-section">
      <div class="aqi-header">
        <span>AQI</span>
        <span>{{ aqi }}</span>
        <span>300 <i class="fas fa-info-circle"></i></span>
      </div>
      <div class="aqi-bar">
        <div 
          class="aqi-progress" 
          :style="{ width: `${aqiPercentage}%` }"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AqiSection',
    props: {
      aqi: {
        type: Number,
        required: true
      },
      aqiPercentage: {
        type: Number,
        required: true
      }
    }
  }
  </script>
  
  