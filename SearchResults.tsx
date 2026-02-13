
import React, { useState, useMemo } from 'react';
import { Place, Coordinates } from '../../types';
import GlassCard from '../UI/GlassCard';
import { 
  Navigation, 
  X, 
  ArrowRight,
  Mic,
  Zap,
  Clock
} from 'lucide-react';

interface SearchResultsProps {
  places: Place[];
  userLocation: Coordinates;
  onSelect: (place: Place) => void;
  onHover: (place: Place) => void;
  onLeave: () => void;
  onDismiss?: () => void;
}

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const formatDistance = (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
};

const SearchResults: React.FC<SearchResultsProps> = ({ places, userLocation, onSelect, onHover, onLeave, onDismiss }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sortedPlaces = useMemo(() => {
    // Show only the top 3 most relevant matches for vertical centering & speed
    return [...places].slice(0, 3).sort((a, b) => {
        const distA = getDistanceKm(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = getDistanceKm(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
    });
  }, [places, userLocation]);

  if (places.length === 0) return null;

  return (
    <div className="pointer-events-auto w-full max-w-[280px] animate-zoom-in">
      <GlassCard className="w-full bg-slate-950/98 border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.95)] rounded-[2.5rem] overflow-hidden flex flex-col relative">
        
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Found places</span>
          <button 
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-white/10 text-slate-600 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean List */}
        <div className="p-2 flex flex-col gap-1">
           {sortedPlaces.map((place, idx) => {
              const isHovered = hoveredId === place.id;
              const distKm = getDistanceKm(userLocation.lat, userLocation.lng, place.coordinates.lat, place.coordinates.lng);
              
              return (
                <button
                  key={place.id}
                  onMouseEnter={() => { setHoveredId(place.id); onHover(place); }}
                  onMouseLeave={() => { setHoveredId(null); onLeave(); }}
                  onClick={() => onSelect(place)}
                  className={`group relative w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 border ${
                    isHovered 
                     ? 'bg-purple-600/15 border-purple-500/40 scale-[1.03] z-10' 
                     : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                      {/* Number */}
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-[11px] transition-all shadow-lg ${
                        isHovered ? 'bg-purple-500 border-purple-400 text-white' : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}>
                          {idx + 1}
                      </div>
                      
                      <div className="flex flex-col text-left min-w-0">
                          <span className={`text-[13px] font-black tracking-tight truncate leading-tight ${isHovered ? 'text-white' : 'text-slate-300'}`}>
                              {place.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                  {formatDistance(distKm)}
                              </span>
                              {place.eta && (
                                <div className="flex items-center gap-1">
                                  <div className="w-0.5 h-0.5 rounded-full bg-slate-700" />
                                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">
                                      {place.eta}
                                  </span>
                                </div>
                              )}
                          </div>
                      </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 transition-all duration-500 ${isHovered ? 'text-purple-400 translate-x-0 opacity-100' : 'text-slate-800 translate-x-2 opacity-0'}`} />
                </button>
              );
           })}
        </div>

        {/* Status */}
        <div className="px-6 py-4 bg-purple-500/5 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping absolute inset-0" />
                 <div className="w-2 h-2 rounded-full bg-purple-500 relative" />
              </div>
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Ready to go</span>
           </div>
           <Mic className="w-3.5 h-3.5 text-purple-900" />
        </div>

        {/* Usage */}
        <div className="px-6 py-2.5 bg-slate-950 flex justify-center border-t border-white/5">
           <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.2em]">Say "number one" or tap a place</span>
        </div>

      </GlassCard>
    </div>
  );
};

export default SearchResults;
