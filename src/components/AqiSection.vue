<template>
  <div class="aqi-section">
    <div class="aqi-header">
      <span>AQI</span>
      <span class="aqi-value">
        {{ aqi }}
        <i class="fas fa-info-circle info-icon">
          <span class="tooltip">300+ AQI is considered hazardous</span>
        </i>
      </span>
    </div>
    <div class="aqi-bar">
      <div class="aqi-progress" :style="{ width: `${aqiPercentage}%` }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AqiSection',
  props: {
    aqi: {
      type: Number,
      required: true
    },
    aqiPercentage: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.aqi-section {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin-bottom: 32px;
}

.aqi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #0E121B;
  margin-bottom: 8px;
}

.aqi-value {
  display: flex;
  align-items: center;
}

.info-icon {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #CACFD8;
  cursor: pointer;
  margin-left: 3px;
}

.tooltip {
  position: absolute;
  top: -27px;
  right: 0;
  background: white;
  padding: 6px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #E1E4EA;
  font-size: 10px;
  font-family: sans-serif;
  font-weight: 100;
  color: #111;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
  z-index: 10;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 1%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: white;
}

.info-icon:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.aqi-bar {
  height: 6px;
  background: #E1E4EA;
  border-radius: 2px;
  overflow: hidden;
}

.aqi-progress {
  height: 100%;
  background: #ef4444;
  transition: width 0.7s ease;
}
</style>
