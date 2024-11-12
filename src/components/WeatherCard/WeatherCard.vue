<template>
  <div class="weather-card">
    <header class="card-header">
      <h1>{{ cityName }}</h1>
      <p class="date-time">{{ currentDateTime }}</p>
      <button class="settings-button" @click="toggleDropdown" aria-label="Settings">
        <i class="fas fa-cog"></i>
      </button>
    </header>

    <transition name="fade">
      <div v-if="dropdownVisible" class="settings-dropdown">
        <div class="settings-group">
          <h3>Temperature</h3>
          <div class="settings-options">
            <button 
              :class="{ active: temperatureUnit === 'C' }" 
              @click="updateTemperatureUnit('C')">°C</button>
            <button 
              :class="{ active: temperatureUnit === 'F' }" 
              @click="updateTemperatureUnit('F')">°F</button>
          </div>
        </div>
        <div class="settings-group">
          <h3>Measurement</h3>
          <div class="settings-options">
            <button 
              :class="{ active: measurementUnit === 'metric' }" 
              @click="updateMeasurementUnit('metric')">Metric</button>
            <button 
              :class="{ active: measurementUnit === 'imperial' }" 
              @click="updateMeasurementUnit('imperial')">Imperial</button>
          </div>
        </div>
      </div>
    </transition>

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

    <div class="weather-metrics">
      <div class="metric" v-for="(condition, index) in weatherConditions" :key="index">
        <i :class="condition.icon"></i>
        <span class="metric-name">{{ condition.name }}</span>
        <span class="metric-value">{{ condition.value }}</span>
      </div>
    </div>

    <div class="aqi-section">
      <div class="aqi-header">
        <span>AQI</span>
        <span>{{ aqi }}</span>
        <span>300
          <i class="fas fa-info-circle"></i>
        </span>
      </div>
      <div class="aqi-bar">
        <div class="aqi-progress" :style="{ width: `${aqiPercentage}%` }"></div>
      </div>
    </div>

    <div class="forecast-section">
      <div class="forecast-tabs">
        <button 
          :class="{ active: activeTab === 'hourly' }"
          @click="toggleTab('hourly')"
        >
          Hourly Forecast
        </button>
        <button 
          :class="{ active: activeTab === 'daily' }"
          @click="toggleTab('daily')"
        >
          7-Day Forecast
        </button>
      </div>

      <div class="forecast-content" :class="activeTab">
        <div v-if="activeTab === 'hourly'" class="forecast-scroll">
          <div v-for="(hour, index) in hourlyForecast" :key="index" class="forecast-item">
            <span class="forecast-time">{{ hour.time }}</span>
            <i :class="hour.icon"></i>
            <span class="forecast-temp">{{ hour.temp }}°</span>
          </div>
        </div>
        <div v-if="activeTab === 'daily'" class="forecast-scroll">
          <div v-for="(day, index) in dailyForecast" :key="index" class="forecast-item">
            <span class="forecast-day">{{ day.date }}</span>
            <i :class="day.icon"></i>
            <span class="forecast-temp">{{ day.temp }}°</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import settingsIcon from '@/assets/settings-4-fill.svg';
import { fetchWeatherDataByCoordinates, fetchWeatherDataByCity } from '@/services/weatherService';

export default {
  data() {
    return {
      cityName: 'London', 
      activeTab: 'hourly',
      dropdownVisible: false,
      temperatureUnit: 'C',
      measurementUnit: 'metric',
      hourlyForecast: [] as { time: string; temp: number; icon: string; feels_like?: number }[],
      dailyForecast: [] as { date: string; temp: number; icon: string }[],
      weatherConditions: [] as { name: string; value: string; icon: string }[],
      weatherIcon: '',
      weatherDescription: '',
      aqi: 0,
      aqiPercentage: 0,
      settingsIcon,
      lat: null as number | null,
      lon: null as number | null,
    };
  },
  computed: {
    formattedTemperature(): string {
      const temp = this.temperatureUnit === 'F'
        ? (this.hourlyForecast[0]?.temp * 9 / 5 + 32).toFixed(1)
        : this.hourlyForecast[0]?.temp;
      return String(temp) || 'N/A';
    },
    formattedFeelsLike(): string {
      const feelsLike = this.temperatureUnit === 'F'
        ? (this.hourlyForecast[0]?.feels_like ?? 0 * 9 / 5 + 32).toFixed(1)
        : this.hourlyForecast[0]?.feels_like;
      return String(feelsLike) || 'N/A';
    },
    currentDateTime(): string {
      return new Date().toLocaleString(); 
    }
  },
  methods: {
    toggleTab(tab: string): void {
      this.activeTab = tab;
    },
    toggleDropdown(): void {
      this.dropdownVisible = !this.dropdownVisible;
    },
    updateTemperatureUnit(unit: string): void {
      this.temperatureUnit = unit;
    },
    updateMeasurementUnit(unit: string): void {
      this.measurementUnit = unit;
    },
    getLocation(): void {
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
            localStorage.setItem('lat', this.lat.toString());
            localStorage.setItem('lon', this.lon.toString());
            this.fetchWeatherData(this.lat, this.lon);
          },
          error => {
            console.error('Geolocation error:', error);
            this.fetchWeatherDataByCity(this.cityName); 
          }
        );
      } else {
        console.error('Geolocation not supported');
        this.fetchWeatherDataByCity(this.cityName); 
      }
    },
    async fetchWeatherData(lat: number, lon: number): Promise<void> {
      try {
        const data = await fetchWeatherDataByCoordinates(lat, lon);
        this.updateWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    },
    async fetchWeatherDataByCity(city: string): Promise<void> {
      try {
        const data = await fetchWeatherDataByCity(city);
        this.updateWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data by city:', error);
      }
    },
    updateWeatherData(data: any): void {
  this.cityName = data.name;
  this.weatherDescription = data.weather[0].description;
  
  // Map weather conditions to Font Awesome icons
  const weatherIconMap: Record<string, string> = {
    'clear': 'fas fa-sun',            // Clear sky
    'clouds': 'fas fa-cloud',         // Clouds
    'rain': 'fas fa-cloud-showers-heavy', // Rain
    'drizzle': 'fas fa-cloud-rain',   // Drizzle
    'thunderstorm': 'fas fa-bolt',    // Thunderstorm
    'snow': 'fas fa-snowflake',       // Snow
    'mist': 'fas fa-smog',            // Mist
    'fog': 'fas fa-smog',             // Fog
    'haze': 'fas fa-smog',            // Haze
  };
  

  const mainCondition = data.weather[0].main.toLowerCase();
  console.log(mainCondition);
  
 
  this.weatherIcon = weatherIconMap[mainCondition] || 'fas fa-cloud';  
  

  this.hourlyForecast = [
    { time: 'Now', temp: data.main.temp, feels_like: data.main.feels_like, icon: this.weatherIcon },
    { time: '1 PM', temp: data.main.temp + 1, icon: this.weatherIcon },
    { time: '2 PM', temp: data.main.temp + 2, icon: this.weatherIcon },
    { time: '3 PM', temp: data.main.temp + 3, icon: this.weatherIcon },
  ];

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
    { name: 'AQI', value: this.aqi.toString(), icon: 'https://img.icons8.com/ios/50/000000/air-quality.png' }
  ];

  this.aqi = 300;
  this.aqiPercentage = Math.min(this.aqi / 500 * 100, 100);
}
,
  },
  mounted() {
    this.getLocation();
  }
};
</script>

<style scoped src="./WeatherCard.css"></style>
