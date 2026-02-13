import React from 'react';
import { Marker } from 'react-map-gl';
import { Place } from '../../types';
import { MapPin } from 'lucide-react';

interface MapMarkerProps {
  place: Place;
  onSelect: (place: Place) => void;
}

/**
 * Compatible MapMarker component for Mapbox GL.
 * Note: MapView.tsx currently handles markers inline, but this is updated 
 * to prevent any legacy Leaflet imports from breaking the app.
 */
const MapMarker: React.FC<MapMarkerProps> = ({ place, onSelect }) => {
  return (
    <Marker 
      longitude={place.coordinates.lng} 
      latitude={place.coordinates.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onSelect(place);
      }}
    >
      <div className="cursor-pointer group relative">
         <MapPin className="w-8 h-8 text-purple-500 fill-slate-900 drop-shadow-lg" />
      </div>
    </Marker>
  );
};

export default MapMarker;