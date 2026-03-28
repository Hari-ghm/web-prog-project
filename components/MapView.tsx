'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix default icon issue
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const solarIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background:#f59e0b;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(245,158,11,0.5);border:2px solid #fbbf24;">☀️</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const windIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background:#06b6d4;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(6,182,212,0.5);border:2px solid #22d3ee;">💨</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const hydroIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background:#3b82f6;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(59,130,246,0.5);border:2px solid #60a5fa;">💧</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface Source {
  _id: string;
  name: string;
  type: string;
  state: string;
  city: string;
  capacityKW: number;
  status: string;
  lat?: number;
  lng?: number;
}

function getIcon(type: string) {
  switch (type) {
    case 'solar': return solarIcon;
    case 'wind': return windIcon;
    case 'hydro': return hydroIcon;
    default: return defaultIcon;
  }
}

export default function MapView({ sources }: { sources: Source[] }) {
  const validSources = sources.filter(s => s.lat && s.lng);

  const center: [number, number] = validSources.length > 0
    ? [validSources[0].lat!, validSources[0].lng!]
    : [13.0, 78.0]; // Default South India center

  return (
    <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {validSources.map((source) => (
        <Marker key={source._id} position={[source.lat!, source.lng!]} icon={getIcon(source.type)}>
          <Popup>
            <div style={{ color: '#1e293b', minWidth: '200px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{source.name}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{source.city}, {source.state}</p>
              <div style={{ fontSize: '12px' }}>
                <p><strong>Type:</strong> {source.type}</p>
                <p><strong>Capacity:</strong> {source.capacityKW >= 1000 ? `${(source.capacityKW / 1000).toFixed(0)} MW` : `${source.capacityKW} kW`}</p>
                <p><strong>Status:</strong> <span style={{ color: source.status === 'active' ? '#22c55e' : source.status === 'maintenance' ? '#f59e0b' : '#94a3b8' }}>{source.status}</span></p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
