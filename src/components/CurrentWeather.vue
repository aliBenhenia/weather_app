<template>
  <div class="current-weather">
    <div class="temperature-display">
      <img v-if="weatherIcon === 'clouds' || weatherIcon === 'clear'" src="@/assets/icons/CloudyLine.svg" alt="Cloudy weather icon" />
      <img v-else-if="weatherIcon === 'rain'" src="@/assets/icons/showers-line.svg" alt="Rainy weather icon" />
      <img v-else-if="weatherIcon === 'sun'" src="@/assets/icons/sun-line.svg" alt="Sunny weather icon" />
      <img v-else src="@/assets/icons/sun-line.svg" alt="Snowy weather icon" />
      <span class="current-temp">{{ formattedTemperature }}°</span>
    </div>
    <div class="weather-info">
      <p class="weather-description">{{ weatherDescription }}</p>
      <p class="feels-like">Feels like {{ formattedFeelsLike }}°</p>
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
