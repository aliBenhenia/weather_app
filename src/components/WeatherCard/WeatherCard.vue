<template>
  <div class="weather-card">
    <div class="header">
      {{ cityName }}
      <span class="icon-container" @click="toggleDropdown">
        <img class="settings-icon" :src="settingsIcon" alt="Settings">
      </span>
    </div>

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

    <div class="date-time">
      {{ currentDateTime }}
    </div>

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

    <div class="forecast-tabs">
      <div class="tab" :class="{ active: activeTab === 'hourly' }" @click="toggleTab('hourly')">Hourly Forecast</div>
      <div class="tab" :class="{ active: activeTab === 'daily' }" @click="toggleTab('daily')">7-Day Forecast</div>
    </div>

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
      return temp || 'N/A';
    },
    formattedFeelsLike(): string {
      const feelsLike = this.temperatureUnit === 'F'
        ? (this.hourlyForecast[0]?.feels_like * 9 / 5 + 32).toFixed(1)
        : this.hourlyForecast[0]?.feels_like;
      return feelsLike || 'N/A';
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
      this.weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      
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
    },
  },
  mounted() {
    this.getLocation();
  }
};
</script>

<style scoped src="./WeatherCard.css"></style>
