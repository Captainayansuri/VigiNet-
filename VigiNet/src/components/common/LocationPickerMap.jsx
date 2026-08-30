import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Compass } from 'lucide-react';

// Custom OceanOS glowing pin icon
const customIcon = new L.DivIcon({
  className: 'custom-leaflet-marker',
  html: `<div class="relative flex items-center justify-center w-8 h-8">
    <span class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></span>
    <span class="relative w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-lg shadow-cyan-500/50"></span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function MapEventsHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function LocationPickerMap({ 
  lat, 
  lng, 
  accuracyMeters = 14, 
  onLocationChange,
  interactive = true 
}) {
  const [mapCenter, setMapCenter] = useState(lat != null && lng != null ? [lat, lng] : null);
  const [position, setPosition] = useState(lat != null && lng != null ? [lat, lng] : null);

  useEffect(() => {
    if (lat != null && lng != null) {
      setMapCenter([lat, lng]);
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handleSelect = (newLat, newLng) => {
    setPosition([newLat, newLng]);
    if (onLocationChange) {
      onLocationChange(newLat, newLng);
    }
  };

  if (!mapCenter || !position) {
    return <div className="w-full h-52 rounded-xl border border-slate-800 bg-[#090d16] flex items-center justify-center text-center px-6 text-xs text-slate-400">Get your location first, or add a landmark manually. VigiNet will not invent a map position.</div>;
  }

  return (
    <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-inner">
      <MapContainer
        center={mapCenter}
        zoom={15}
        scrollWheelZoom={false}
        dragging={interactive}
        touchZoom={interactive}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        {/* OpenStreetMap Humanitarian / Dark Styled Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tile-dark"
        />

        <Marker
          position={position}
          icon={customIcon}
          draggable={interactive}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const newPos = marker.getLatLng();
              handleSelect(newPos.lat, newPos.lng);
            }
          }}
        />

        {accuracyMeters && (
          <Circle
            center={position}
            radius={accuracyMeters}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#06b6d4',
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '4, 4'
            }}
          />
        )}

        <MapEventsHandler onLocationSelect={handleSelect} />
      </MapContainer>

      {/* Floating map controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        <div className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 shadow-md">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>±{accuracyMeters}m GPS</span>
        </div>
      </div>

      {/* Interactive Helper Toast */}
      {interactive && (
        <div className="absolute bottom-2 left-2 right-2 z-10 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] text-slate-300 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tap map or drag marker to adjust position</span>
          </div>
          <span className="font-mono text-cyan-400 text-[10px]">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
