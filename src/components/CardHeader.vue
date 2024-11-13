<template>
  <header class="card-header">
    <h1>{{ cityName }}</h1>
    <p class="date-time">{{ formattedDate }}</p>
    <p class="time">{{ formattedTime }}</p> 
    <button class="settings-button" @click="toggleDropdown" aria-label="Settings">
      <img src="@/assets/icons/settings-4-fill.svg" alt="Settings" width="24" height="24" />
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
  computed: {
    formattedDate() {
      const date = new Date(this.currentDateTime);
      return date.toLocaleDateString("en-US", {
        weekday: "long", 
        month: "long", 
        day: "numeric", 
        year: "numeric",
      });
    },
    formattedTime() {
      const date = new Date(this.currentDateTime);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    },
  },
};
</script>
