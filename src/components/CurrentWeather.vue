<template>
  <div class="current-weather">
    <div class="temperature-display">
      <i :class="weatherIcon"></i>
      <span class="current-temp">{{ formattedTemperature }}</span>
    </div>
    <div class="weather-info">
      <p class="weather-description">{{ weatherDescription }}</p>
      <p class="feels-like">Feels like {{ formattedFeelsLike }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrentWeather',
  props: {
    weatherIcon: {
      type: String,
      required: true
    },
    formattedTemperature: {
      type: String,
      required: true
    },
    weatherDescription: {
      type: String,
      required: true
    },
    formattedFeelsLike: {
      type: String,
      required: true
    }
  }
}
</script>
