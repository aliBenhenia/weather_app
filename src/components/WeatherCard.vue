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

    <!-- Location Access Denial Notification -->
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
      loading: true, // Loading state
      locationDenied: false, // Location access denial flag
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
            this.locationDenied = true; // Show error message
            this.fetchWeatherDataByCity(this.cityName); // Fallback to default city
          }
        );
      } else {
        console.error('Geolocation not supported');
        this.fetchWeatherDataByCity(this.cityName); // Fallback to default city
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
        name: 'AQI',
        value: this.aqi.toString(),
        icon: 'fas fa-smog' 
      }
      ];

      this.aqi = 300; // Sample AQI
      this.aqiPercentage = (this.aqi / 500) * 100;

      this.loading = false; // Hide loader once data is fetched
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
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 10;
}

.location-alert-content h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.location-alert-content p {
  font-size: 1rem;
  margin-bottom: 20px;
}

.retry-button {
  padding: 10px 20px;
  background-color: #fff;
  color: #f44336;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #f44336;
  color: #fff;
}
</style>
