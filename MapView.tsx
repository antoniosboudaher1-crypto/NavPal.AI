
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Map, { Marker, Source, Layer, MapRef, NavigationControl, ViewStateChangeEvent } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { Coordinates, Place, NavigationRoute, MapMode, MapReport, ReportType, MapStyle, User, NavRuntimeConfig, Theme, Driver } from '../../types';
import { AlertCircle, Car, Bike, Truck, Rocket, Zap, ZapOff, Activity, Shield, Sparkles } from 'lucide-react';
import { MAPBOX_ACCESS_TOKEN } from '../../constants';

interface MapViewProps {
  center: Coordinates;
  places: Place[];
  reports?: MapReport[];
  drivers?: Driver[];
  selectedPlace: Place | null;
  selectedReport?: MapReport | null;
  route: NavigationRoute | null;
  previewRoute: NavigationRoute | null;
  mapMode: MapMode;
  mapStyle: MapStyle;
  showTraffic: boolean;
  onSelectPlace: (place: Place) => void;
  onSelectReport?: (report: MapReport) => void;
  onMapClick: (coords: Coordinates) => void;
  recenterTrigger: number;
  fitRouteTrigger?: number;
  userVehicleType?: User['vehicleType'];
  onMapInteraction?: () => void;
  onUserMarkerClick?: () => void;
  currentUserId?: string;
  isMapCentered?: boolean;
  currentSpeed?: number;
  navRuntime?: NavRuntimeConfig;
  theme?: Theme;
  userMarkerColor?: string;
  userMarkerStyle?: User['markerStyle'];
}

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

/**
 * 5D NEURAL VEHICLE INTERFACE
 * Bespoke renders for specific legend models
 */
const Vehicle5DRender = ({ type, color, style, isBraking, isAccelerating }: { type?: string, color: string, style?: string, isBraking: boolean, isAccelerating: boolean }) => {
  // Model Geometry Definition
  const models: Record<string, { chassis: string, cabin: string, extra?: React.ReactNode }> = {
    'bmw_m3': {
      chassis: "M 12 45 L 8 40 L 10 15 L 70 15 L 72 40 L 68 45 Z", // Aggressive sedan silhouette
      cabin: "M 22 18 L 58 18 L 54 30 L 26 30 Z",
      extra: (
        <g>
           {/* Iconic Vertical Kidney Grilles */}
           <rect x="35" y="42" width="4" height="6" rx="1" fill="#111" />
           <rect x="41" y="42" width="4" height="6" rx="1" fill="#111" />
           {/* Aggressive M-Headlights */}
           <path d="M 15 40 L 25 38" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
           <path d="M 55 38 L 65 40" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
        </g>
      )
    },
    'audi_rs5': {
      chassis: "M 10 44 Q 5 40 8 15 L 72 15 Q 75 40 70 44 Z", // Sleek Sportback flow
      cabin: "M 25 17 Q 40 14 55 17 L 52 28 L 28 28 Z",
      extra: (
        <g>
           {/* Wide Hex Grille */}
           <path d="M 30 42 L 50 42 L 55 46 L 25 46 Z" fill="#111" />
           {/* Wide Quattro Arches */}
           <path d="M 8 30 Q 5 35 8 40" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
           <path d="M 72 30 Q 75 35 72 40" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
        </g>
      )
    },
    'porsche_911': {
      chassis: "M 12 40 Q 8 30 20 18 L 55 18 Q 72 30 68 45 L 15 45 Z", // Teardrop hips
      cabin: "M 22 20 Q 38 18 52 22 L 50 32 L 25 32 Z",
      extra: <circle cx="40" cy="42" r="6" fill="black" fillOpacity="0.1" /> // Rear engine deck
    },
    'lamborghini_h': {
      chassis: "M 5 45 L 20 12 L 60 12 L 75 45 Z", // Low wedge
      cabin: "M 28 14 L 52 14 L 50 25 L 30 25 Z",
      extra: <path d="M 15 12 L 65 12 L 60 8 L 20 8 Z" fill="white" fillOpacity="0.1" /> // STO Roof scoop
    },
    'cyber_truck': {
      chassis: "M 5 45 L 30 5 L 75 45 Z", // Brutalist triangle
      cabin: "M 25 15 L 45 15 L 40 25 L 28 25 Z",
      extra: <rect x="5" y="42" width="70" height="1" fill="#fff" fillOpacity="0.8" /> // Front light bar
    },
    'ducati_pani': {
      chassis: "M 35 45 L 38 10 L 42 10 L 45 45 Z", // Slim bike profile
      cabin: "M 39 12 L 41 12 L 41 18 L 39 18 Z",
    },
    'honda_civic': {
      chassis: "M 8 42 Q 8 20 25 18 L 55 18 Q 72 20 72 42 L 12 42 Z",
      cabin: "M 22 20 Q 40 18 58 20 L 55 35 L 25 35 Z",
    }
  };

  const model = models[type || 'honda_civic'] || models.honda_civic;

  // 5D Dynamic Pitch/Squat
  const transform = isBraking ? 'translateY(2px) scaleY(0.98)' : isAccelerating ? 'translateY(-2px) scaleY(1.02)' : 'none';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center" style={{ perspective: '1000px' }}>
      <div 
        className={`absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-700 ${style === 'glow' ? 'scale-150' : 'scale-100'}`}
        style={{ backgroundColor: color }}
      />
      
      <div className="relative w-16 h-16 transition-all duration-500" style={{ transformStyle: 'preserve-3d', transform }}>
        <svg viewBox="0 0 80 60" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#fff', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>

          {/* 5D Shadow Cast */}
          <path d={model.chassis} fill="#000" fillOpacity="0.4" transform="translate(3, 6) scale(0.98)" filter="blur(3px)" />

          {/* Neural Chassis */}
          <path d={model.chassis} fill={`url(#grad-${type})`} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          
          {/* Reactive Glass */}
          <path d={model.cabin} fill="rgba(10, 10, 20, 0.95)" />

          {/* Model Extras (Spoilers/Details) */}
          {model.extra}

          {/* High-Intensity Headlights */}
          <circle cx="15" cy="40" r="1.5" fill={isAccelerating ? "#fff" : "#ffffcc"} opacity={isAccelerating ? 1 : 0.6} />
          <circle cx="65" cy="40" r="1.5" fill={isAccelerating ? "#fff" : "#ffffcc"} opacity={isAccelerating ? 1 : 0.6} />

          {/* Reactive Brake Luminescence */}
          {isBraking && (
            <g filter="blur(2px)">
               <rect x="10" y="43" width="10" height="2" fill="#ff0000" />
               <rect x="60" y="43" width="10" height="2" fill="#ff0000" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

const getDist = (lon1: number, lat1: number, lon2: number, lat2: number) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const a = Math.sin((lat2-lat1)*Math.PI/360) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((lon2-lon1)*Math.PI/360) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const UserMarkerFlesh = ({ heading, isNavigating, color, vehicleType, style, currentSpeed }: { heading: number, isNavigating: boolean, color?: string, vehicleType?: string, style?: string, currentSpeed: number }) => {
  const [prevSpeed, setPrevSpeed] = useState(0);
  const [isBraking, setIsBraking] = useState(false);
  const [isAccelerating, setIsAccelerating] = useState(false);

  useEffect(() => {
    if (currentSpeed < prevSpeed - 2) { setIsBraking(true); setIsAccelerating(false); }
    else if (currentSpeed > prevSpeed + 2) { setIsAccelerating(true); setIsBraking(false); }
    else { setIsBraking(false); setIsAccelerating(false); }
    setPrevSpeed(currentSpeed);
  }, [currentSpeed]);

  const tilt = isNavigating ? Math.min(currentSpeed / 2.5, 12) : 0;
  
  return (
    <div className="relative flex items-center justify-center w-24 h-24" style={{ transform: `rotate(${heading}deg)`, transformStyle: 'preserve-3d' }}>
      <div className="transition-transform duration-500 ease-out" style={{ transform: `rotateX(${tilt}deg)` }}>
        <Vehicle5DRender type={vehicleType} color={color || '#a855f7'} style={style} isBraking={isBraking} isAccelerating={isAccelerating} />
      </div>
    </div>
  );
};

const MapView: React.FC<MapViewProps> = ({ 
  center, places, reports = [], drivers = [], selectedPlace, selectedReport, route, previewRoute, mapMode, mapStyle,
  onSelectPlace, onSelectReport, onMapClick, recenterTrigger, fitRouteTrigger = 0, onMapInteraction, onUserMarkerClick,
  isMapCentered = true, currentSpeed = 0, navRuntime, theme = 'dark', userMarkerColor, userVehicleType, userMarkerStyle
}) => {
  const mapRef = useRef<MapRef>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const lastHandledRecenterRef = useRef(0);
  const isDark = theme === 'dark';

  const routeProgress = useMemo(() => {
    const targetRoute = route || previewRoute;
    if (!targetRoute || !targetRoute.geometry?.geometry?.coordinates) return 0;
    const coords = targetRoute.geometry.geometry.coordinates;
    if (coords.length < 2) return 0;
    
    let totalDist = 0;
    for (let i = 0; i < coords.length - 1; i++) totalDist += getDist(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1]);
    
    let minDist = Infinity;
    let closestIdx = 0;
    for (let i = 0; i < coords.length; i++) {
        const d = getDist(center.lng, center.lat, coords[i][0], coords[i][1]);
        if (d < minDist) { minDist = d; closestIdx = i; }
    }
    
    let traveled = 0;
    for (let i = 0; i < closestIdx; i++) traveled += getDist(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1]);
    return Math.min(1, traveled / totalDist);
  }, [center, route, previewRoute]);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    if (mapMode === MapMode.NAVIGATION && isMapCentered) {
      mapRef.current.easeTo({
        center: [center.lng, center.lat],
        zoom: navRuntime?.camera?.zoom_city || 18,
        pitch: navRuntime?.camera?.pitch || 65,
        bearing: center.heading || 0,
        padding: { top: 150, bottom: 250, left: 0, right: 0 },
        duration: 800,
        essential: true
      });
    } else if (recenterTrigger !== lastHandledRecenterRef.current) {
      lastHandledRecenterRef.current = recenterTrigger;
      mapRef.current.easeTo({ center: [center.lng, center.lat], zoom: 16, pitch: 0, bearing: 0, duration: 1000 });
    }
  }, [center, mapMode, recenterTrigger, isMapReady, isMapCentered, navRuntime]);

  return (
    <div className={`h-full w-full relative ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: center.lng, latitude: center.lat, zoom: 15 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        onMove={(e) => { if (e.originalEvent && onMapInteraction) onMapInteraction(); }}
        onClick={(e) => onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
        onLoad={() => setIsMapReady(true)}
        maxPitch={85}
      >
        {(route || previewRoute)?.geometry && (
          <Source id="nav-line" type="geojson" data={(route || previewRoute).geometry} lineMetrics={true}>
            <Layer id="glow" type="line" paint={{ 'line-color': isDark ? '#a855f7' : '#4f46e5', 'line-width': 40, 'line-opacity': 0.1, 'line-blur': 10 }} />
            <Layer id="main" type="line" paint={{ 
                'line-width': 10,
                'line-gradient': [
                  'interpolate', ['linear'], ['line-progress'],
                  0, 'rgba(0,0,0,0)',
                  Math.max(0, routeProgress - 0.01), 'rgba(0,0,0,0)',
                  routeProgress, isDark ? '#fff' : '#4f46e5',
                  1.0, isDark ? '#a855f7' : '#312e81'
                ]
            }} />
          </Source>
        )}

        <Marker longitude={center.lng} latitude={center.lat} anchor="center">
          <UserMarkerFlesh 
            heading={mapMode === MapMode.NAVIGATION && isMapCentered ? 0 : (center.heading || 0)} 
            isNavigating={mapMode === MapMode.NAVIGATION}
            color={userMarkerColor}
            vehicleType={userVehicleType}
            style={userMarkerStyle}
            currentSpeed={currentSpeed}
          />
        </Marker>

        {places.map(p => (
          <Marker key={p.id} longitude={p.coordinates.lng} latitude={p.coordinates.lat} anchor="center">
            <div onClick={() => onSelectPlace(p)} className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white shadow-xl cursor-pointer" />
          </Marker>
        ))}

        {reports.map(r => (
          <Marker key={r.id} longitude={r.coordinates.lng} latitude={r.coordinates.lat} anchor="center">
            <div onClick={() => onSelectReport?.(r)} className={`w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white ${r.type === ReportType.ACCIDENT ? 'bg-red-600' : 'bg-amber-500'}`}>
               <AlertCircle className="w-4 h-4" />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapView;
