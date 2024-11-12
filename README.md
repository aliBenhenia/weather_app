# Weather App

A responsive weather app built with **Vue 3.5**, **TypeScript**, and **Vanilla CSS**, utilizing the **OpenWeatherMap API** for  weather data, with **FontAwesome** icons for visuals. The app runs in a Dockerized environment with **Docker Compose** for easy setup.

## Stack

- **Vue 3.5 + TypeScript**: Framework and type safety
- **Axios**: For fetching API data
- **FontAwesome**: Icons for weather visuals
- **Docker Compose**: For containerized setup

## Features

- **Current Weather & AQI**: Displays temperature, AQI, and additional weather details such as humidity and wind speed.
- **LocalStorage Geolocation**: Caches user location in **LocalStorage** to handle issues with geolocation on page refresh.

## Challenges Faced

- **Geolocation on Refresh**: Initial geolocation access worked but failed upon page refresh in some browsers. This was fixed by storing coordinates in **LocalStorage** to persist location data across sessions.

## Running the App

1. **Run with Docker Compose**:

   ```bash
   docker-compose up --build
2. **or manual install** :
    ```bash
        npm i
        npm run dev
