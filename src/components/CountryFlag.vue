<template>
  <div>
    <div v-if="country" class="country-flag-tooltip">
      <img :src="countryFlagUrl" alt="Country Flag" class="country-flag" @click="toggleDropdown" />
      <div v-if="isDropdownVisible" class="dropdown">
        <div class="dropdown-item">
          <strong>Country:</strong> {{ countryName }}
        </div>
        <div class="dropdown-item">
          <strong>City:</strong> {{ city }}
        </div>
        <div class="dropdown-item">
          <strong>Continent:</strong> {{ continent }}
        </div>
        <div class="dropdown-item">
          <strong>Currency:</strong> {{ currency }}
        </div>
        <div class="dropdown-item">
          <strong>Time Zone:</strong> {{ timezone }}
        </div>
        <div class="dropdown-item">
          <strong>ISP:</strong> {{ isp }}
        </div>
        <div class="dropdown-item">
          <strong>Region:</strong> {{ region }}
        </div>
        <div class="dropdown-item">
          <strong>Phone Code:</strong> {{ countryPhone }}
        </div>
      </div>
      <div class="tooltip">{{ countryName }} | Welcome!</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      country: null,
      countryFlagUrl: "",
      countryName: "",
      city: "",
      continent: "",
      currency: "",
      timezone: "",
      isp: "",
      region: "",
      countryPhone: "",
      isDropdownVisible: false,
    };
  },
  mounted() {
    this.fetchCountryData();
  },
  methods: {
    async fetchCountryData() {
      try {
        const apiUrl = 'https://ipwhois.app/json/';
        const response = await axios.get(apiUrl);
        const data = response.data;

        this.countryName = data.country;
        this.city = data.city;
        this.continent = data.continent;
        this.currency = data.currency;
        this.timezone = data.timezone;
        this.isp = data.isp;
        this.region = data.region;
        this.countryPhone = data.country_phone;
        this.countryFlagUrl = data.country_flag;

        this.country = data;
      } catch (error) {
        console.error('Failed to fetch country data:', error);
      }
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  padding: 20px;
}

.country-flag-tooltip {
  position: absolute;
  display: flex;
  align-items: center;
  cursor: pointer;
  top: 20px;
  left: 7px;
}

.country-flag {
  width: 50px;
  height: 30px;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.country-flag:hover {
  transform: scale(1.1);
}

.tooltip {
  margin-left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dropdown {
  background-color: white;
  color: #333;
  border-radius: 5px;
  position: absolute;
  top: 40px;
  left: 0;
  padding: 10px;
  z-index: 10;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.dropdown-item strong {
  color: #007bff;
}


@media (max-width: 768px) {
  .country-flag-tooltip
  {
    display: none;
  }
  .dropdown {
    display: none;
  }
}
</style>
