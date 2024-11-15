<template>
  <div class="forecast-content">
    <div class="forecast-list">
      <div v-for="(item, index) in forecastData" :key="index" class="forecast-item">
        <span class="day">{{ item.day || item.hour }}</span>
        <component :is="getIcon(item.icon)" class="icon" :style="getIconColor(item.icon)" />
        <span class="temp">{{ item.temp }}°</span>
        <span class="low-temp" v-if="item.lowTemp">{{ item.lowTemp }}°</span>
      </div>
    </div>
    <div class="gradient-overlay"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CloudIcon, CloudRainIcon, SunIcon } from 'lucide-vue-next'

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
    validator: (value) => ['daily', 'hourly'].includes(value),
  },
})

const dailyForecast = [
  { day: "Mon", temp: 20, lowTemp: 60, icon: "cloud" },
  { day: "Tue", temp: 22, lowTemp: 61, icon: "sun" },
  { day: "Wed", temp: 23, lowTemp: 63, icon: "cloud" },
  { day: "Thu", temp: 24, lowTemp: 64, icon: "rain" },
  { day: "Fri", temp: 19, lowTemp: 62, icon: "cloud" },
  { day: "Sat", temp: 21, lowTemp: 62, icon: "sun" },
  { day: "Sun", temp: 22, lowTemp: 63, icon: "cloud" },
]

const hourlyForecast = [
  { hour: "08:00", temp: 18, icon: "cloud" },
  { hour: "12:00", temp: 22, icon: "sun" },
  { hour: "16:00", temp: 24, icon: "sun" },
  { hour: "20:00", temp: 20, icon: "rain" },
  { hour: "00:00", temp: 18, icon: "cloud" },
  { hour: "04:00", temp: 16, icon: "cloud" },
  { hour: "08:00", temp: 18, icon: "cloud" },

]

const getIcon = (icon) => {
  switch (icon) {
    case "sun":
      return SunIcon
    case "cloud":
      return CloudIcon
    case "rain":
      return CloudRainIcon
    default:
      return SunIcon
  }
}

const getIconColor = (icon) => {
  switch (icon) {
    case "sun":
      return { color: "#F6B51E" }
    case "cloud":
      return { color: "#717784" }
    case "rain":
      return { color: "#335CFF" }
    default:
      return { color: "#F6B51E" }
  }
}

const forecastData = computed(() => (props.activeTab === 'daily' ? dailyForecast : hourlyForecast))
</script>

<style scoped>
.forecast-content {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 28px;
}
.forecast-list {
  display: flex;
  flex-wrap: nowrap;  
  overflow-x: auto;
  padding-bottom: 16px;
  gap: 4px;
  align-items: center;
  width: 100%;

}

.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto; 
  min-width: 20%;  
  max-width: 25%;
}

.day, .hour {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.icon {
  width: 24px;
  height: 24px;
}

.temp {
  font-size: 14px;
  font-weight: 600;
}

.low-temp {
  font-size: 14px;
  color: #9ca3af;
}

.gradient-overlay {
  position: absolute;
  right: -3px;
  top: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(to left, white, transparent);
  pointer-events: none;
}

@media (max-width: 768px) {
  .forecast-list {
    gap: 12px;
  }
  
  .forecast-item {
    min-width: 30%;
    max-width: 30%;
  }

  .day, .hour {
    font-size: 0.875rem;
  }

  .icon {
    width: 24px;
    height: 24px;
  }

  .temp {
    font-size: 1.125rem;
  }

  .low-temp {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .forecast-content {
    width: 300px;
  }
  .forecast-list {
    gap: 8px;
  }

  .forecast-item {
    min-width: 45%;
    max-width: 45%;
    align-items: start;
  }

  .day, .hour {
    font-size: 0.75rem;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .temp {
    font-size: 1rem;
  }

  .low-temp {
    font-size: 0.75rem;
  }
}
</style>
