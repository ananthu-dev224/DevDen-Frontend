import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

interface Location {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAP_API,
  });

  const [marker, setMarker] = useState<Location | null>(null);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const selectedLocation = { lat, lng };
      setMarker(selectedLocation);
      onLocationSelect(selectedLocation);
    }
  }, [onLocationSelect]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={5}
      center={defaultCenter}
      onClick={onMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
};

export default MapPicker;