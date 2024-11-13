<template>
  <div class="weather-card">
    <CardHeader :cityName="cityName" :currentDateTime="currentDateTime" :toggleDropdown="toggleDropdown" />

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

    <div v-if="loading" class="loader">
      <p>Loading weather data...</p>
    </div>

    <CurrentWeather v-if="!loading" :weatherIcon="weatherIcon" :formattedTemperature="formattedTemperature" :weatherDescription="weatherDescription" :formattedFeelsLike="formattedFeelsLike" />
    <WeatherMetrics v-if="!loading" :weatherConditions="weatherConditions" />
    <AqiSection v-if="!loading" :aqi="aqi" :aqiPercentage="aqiPercentage" />

    <div v-if="!loading" class="forecast-section">
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
      <ForecastContent :activeTab="activeTab"  />
    </div>

    <div v-if="locationDenied" class="location-alert">
      <div class="location-alert-content">
        <h3>Location Access Denied</h3>
        <p>To get accurate weather information, please enable location access in your browser settings.</p>
        <button class="retry-button" @click="requestLocationAccess">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import settingsIcon from '@/assets/icons/settings-4-fill.svg';
import { fetchWeatherDataByCoordinates, fetchWeatherDataByCity } from '@/services/weatherService';
import CardHeader from './CardHeader.vue';
import CurrentWeather from './CurrentWeather.vue';
import AqiSection from './AqiSection.vue';
import ForecastContent from './ForecastContent.vue';
import WeatherMetrics from './WeatherMetrics.vue';

export default {
  components: {
    CardHeader,
    CurrentWeather,
    AqiSection,
    ForecastContent,
    WeatherMetrics,
  },
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
      loading: true,
      locationDenied: false,
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
    requestLocationAccess(): void {
      this.locationDenied = false;
      this.getLocation();
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
            this.locationDenied = true;
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
      const mainCondition = data.weather[0].main.toLowerCase();
      this.weatherIcon = mainCondition;

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
        {
          name: 'Humidity',
          value: `${data.main.humidity}%`,
          icon: 'fas fa-tint' 
        },
        {
          name: 'Precipitation',
          value: '15%',
          icon: 'fas fa-cloud-rain' 
        },
        {
          name: 'Wind',
          value: `${data.wind.speed} m/s`,
          icon: 'fas fa-wind'
        },
        {
          name: 'Pressure',
          value: `${data.main.pressure} hPa`,
          icon: 'fas fa-tachometer-alt' 
        },
      ];

      this.aqi = 50;
      this.aqiPercentage = (this.aqi / 500) * 100;

      this.loading = false;
    }
  },
  mounted() {
    this.getLocation(); 
  }
};
</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #fff;
  font-size: 1.5rem;
}

.location-alert {
  background-color: #f44336; 
  color: white;
  border-radius: 10px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.location-alert-content h3 {
  margin-bottom: 10px;
}

.retry-button {
  background-color: #4CAF50; 
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.retry-button:hover {
  background-color: #45a049;
}

.settings-dropdown {
  background-color: #282828;
  color: white;
  padding: 10px;
  border-radius: 8px;
  position: absolute;
  top: 50px;
  right: 20px;
  width: 200px;
}

.settings-group {
  margin-bottom: 20px;
}

.settings-options button {
  background-color: #333;
  color: white;
  border: none;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.settings-options button.active {
  background-color: #00aaff;
}

.forecast-tabs button.active {
  background-color: #00aaff;
}

.forecast-section {
  margin-top: 30px;
}

.forecast-tabs {
  display: flex;
  justify-content: center;
}

.forecast-tabs button {
  background-color: transparent;
  color: white;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 0 10px;
  cursor: pointer;
}

.forecast-tabs button:hover {
  background-color: #555;
}

.weather-card {
  background-color: #00152993;
  color: white;
  border-radius: 15px;
  padding: 20px;
}

.weather-card h2 {
  text-align: center;
  margin-bottom: 20px;
}

.weather-card .weather-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
