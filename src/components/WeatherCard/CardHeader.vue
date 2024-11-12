<template>
    <header class="card-header">
      <h1>{{ cityName }}</h1>
      <p class="date-time">{{ currentDateTime }}</p>
      <button class="settings-button" @click="toggleDropdown" aria-label="Settings">
        <i class="fas fa-cog"></i>
      </button>
    </header>
  </template>
  
  <script>
  export default {
    name: "CardHeader",
    props: {
      cityName: {
        type: String,
        required: true,
      },
      currentDateTime: {
        type: String,
        required: true,
      },
      toggleDropdown: {
        type: Function,
        required: true,
      },
    },
  };
  </script>
  
  
  