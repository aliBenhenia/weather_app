<template>
    <div class="weather-metrics">
      <div
        class="metric"
        v-for="(condition, index) in weatherConditions"
        :key="index"
      >
        <img v-if="condition.name === 'Humidity'" src="@/assets/icons/drop-line.svg" alt="Wind icon" />
        <img v-if="condition.name === 'Wind'" src="@/assets/icons/Vector.svg" alt="Wind icon" />
        <img v-if="condition.name === 'Precipitation'" src="@/assets/icons/showers-line.svg" alt="Wind icon" />
        <img v-if="condition.name === 'AQI'" src="@/assets/icons/Vector(2).svg" alt="Wind icon" />
        <span class="metric-name">{{ condition.name }}</span>
        <span class="metric-value">{{ condition.value }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "WeatherMetrics",
    props: {
      weatherConditions: {
        type: Array,
        required: true,
        default: () => [],
      },
    },
  };
  </script>
  