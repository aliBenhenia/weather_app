<template>
    <div>
      <WeatherCard />
      <CountryFlag />
    </div>
  </template>
  
  <script>
  import WeatherCard from './components/WeatherCard.vue';
  import CountryFlag from './components/CountryFlag.vue';
  
  export default {
    components: {
      WeatherCard,
      CountryFlag,
    }
  };
  </script>
  
  <style>
  </style>