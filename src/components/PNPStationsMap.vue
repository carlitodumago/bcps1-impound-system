<template>
  <div class="pnp-map-container">
    <div class="map-header">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>PNP Stations in Butuan City</span>
    </div>
    <div ref="mapContainer" class="map-canvas"></div>
    
    <div v-if="selectedStation" class="station-popup">
      <button class="close-btn" @click="selectedStation = null">&times;</button>
      <div class="station-details">
        <h3>{{ selectedStation.name }}</h3>
        <p class="station-address"><strong>📍 Address:</strong> {{ selectedStation.address }}</p>
        <p class="station-desc"><strong>ℹ️ Description:</strong> {{ selectedStation.description }}</p>
        <div class="station-image" v-if="selectedStation.image">
          <img :src="selectedStation.image" :alt="selectedStation.name" />
        </div>
        <div class="station-contact">
          <p><strong>📞 Contact:</strong> {{ selectedStation.contact }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapContainer = ref(null)
const selectedStation = ref(null)
let mapInstance = null

const stations = [
  {
    id: 1,
    name: 'BCPO Station 1',
    lat: 8.9674,
    lng: 125.5281,
    address: 'Butuan City Police Station 1, Butuan City, Agusan del Norte',
    description: 'Main Police Station and Traffic Management Center for Station 1',
    contact: '(085) 341-1234',
    image: 'https://via.placeholder.com/300x200?text=BCPO+Station+1'
  },
  {
    id: 2,
    name: 'BCPO Station 2',
    lat: 8.9715,
    lng: 125.5350,
    address: 'Butuan City Police Station 2, Butuan City, Agusan del Norte',
    description: 'Police Station 2 - Northern District',
    contact: '(085) 341-5678',
    image: 'https://via.placeholder.com/300x200?text=BCPO+Station+2'
  },
  {
    id: 3,
    name: 'BCPO Station 3',
    lat: 8.9615,
    lng: 125.5200,
    address: 'Butuan City Police Station 3, Butuan City, Agusan del Norte',
    description: 'Police Station 3 - Southern District',
    contact: '(085) 341-9012',
    image: 'https://via.placeholder.com/300x200?text=BCPO+Station+3'
  },
  {
    id: 4,
    name: 'Traffic Enforcement Unit',
    lat: 8.9680,
    lng: 125.5310,
    address: 'Traffic Enforcement Unit, Butuan City, Agusan del Norte',
    description: 'Traffic Enforcement and Vehicle Registration Services',
    contact: '(085) 341-3456',
    image: 'https://via.placeholder.com/300x200?text=Traffic+Unit'
  },
  {
    id: 5,
    name: 'Police Community Precinct',
    lat: 8.9640,
    lng: 125.5160,
    address: 'Police Community Precinct, Butuan City, Agusan del Norte',
    description: 'Community Policing and Local Support Services',
    contact: '(085) 341-5890',
    image: 'https://via.placeholder.com/300x200?text=Community+Precinct'
  },
  {
    id: 6,
    name: 'Impound Facility',
    lat: 8.9550,
    lng: 125.5400,
    address: 'Vehicle Impound Facility, Butuan City, Agusan del Norte',
    description: 'Central Vehicle Impound and Storage Facility',
    contact: '(085) 341-7890',
    image: 'https://via.placeholder.com/300x200?text=Impound+Facility'
  }
]

onMounted(() => {
  if (!window.L) {
    console.error('Leaflet not loaded')
    return
  }

  // Create map centered on Butuan City
  mapInstance = window.L.map(mapContainer.value).setView([8.9674, 125.5281], 14)

  // Add OSM tiles
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(mapInstance)

  // Add markers for each station
  stations.forEach((station) => {
    const marker = window.L.marker([station.lat, station.lng], {
      icon: window.L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23c9a84c" stroke="%23000" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="%23000"/></svg>',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
      })
    }).addTo(mapInstance)

    marker.on('click', () => {
      selectedStation.value = station
    })

    marker.bindPopup(`<strong>${station.name}</strong><br>${station.address}`)
  })
})
</script>

<style scoped>
.pnp-map-container {
  position: relative;
  width: 100%;
}

.map-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #e0e6ed;
}

.map-header svg {
  width: 20px;
  height: 20px;
  stroke: var(--gold);
}

.map-canvas {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.station-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #1a1f3a 0%, #16213e 100%);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 12px;
  padding: 24px;
  max-width: 450px;
  width: 90%;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;
  overflow-y: auto;
  max-height: 85vh;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.station-popup::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #8892a4;
  font-size: 28px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #c9a84c;
  background: rgba(201, 168, 76, 0.1);
}

.station-details h3 {
  color: var(--gold);
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.station-address,
.station-desc,
.station-contact {
  color: #c8d0dc;
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.5;
}

.station-address strong,
.station-desc strong,
.station-contact strong {
  color: var(--gold);
}

.station-image {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(201, 168, 76, 0.2);
}

.station-image img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
