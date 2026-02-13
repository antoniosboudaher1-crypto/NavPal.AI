
import React from 'react';
import { Place, Coordinates } from '../../types';
import GlassCard from '../UI/GlassCard';
import { Navigation, Star, X, MapPin, Sparkles, Target, Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface POISelectorGridProps {
  places: Place[];
  userLocation: Coordinates;
  onSelect: (place: Place) => void;
  onDismiss: () => void;
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

const POISelectorGrid: React.FC<POISelectorGridProps> = ({ places, userLocation, onSelect, onDismiss }) => {
  if (places.length === 0) return null;

  return (
    <div className="absolute bottom-32 left-0 right-0 z-[60] px-4 pointer-events-none flex flex-col items-center animate-slide-up pb-4">
      <div className="w-full max-w-5xl pointer-events-auto">
        <GlassCard className="bg-[#050508]/98 border-t-2 border-purple-500/50 shadow-[0_50px_120px_rgba(0,0,0,1)] rounded-[3.5rem] overflow-hidden flex flex-col relative">
          
          <div className="px-10 py-6 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-3xl">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                  <Target className="w-6 h-6 text-purple-400" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Sector Manifest</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Grid Logic Active</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onDismiss}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-rose-600 transition-all flex items-center justify-center group active:scale-90"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          <div className="p-8 overflow-x-auto no-scrollbar flex gap-6 overscroll-x-contain scroll-smooth snap-x">
             {places.map((place, idx) => {
                const distKm = getDistanceKm(userLocation.lat, userLocation.lng, place.coordinates.lat, place.coordinates.lng);
                
                return (
                  <button
                    key={place.id}
                    onClick={() => onSelect(place)}
                    className="flex-shrink-0 w-80 group relative flex flex-col bg-white/[0.02] border border-white/5 hover:border-purple-500/50 rounded-[3rem] p-6 transition-all duration-500 active:scale-[0.96] snap-center"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden mb-5 border border-white/10 shadow-2xl bg-slate-900">
                       <img 
                          src={`https://source.unsplash.com/random/500x400/?${place.category?.toLowerCase() || 'sci-fi'},architecture&sig=${idx}`}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                          alt={place.name}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                       <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                          Vector {idx + 1}
                       </div>
                       
                       {place.eta && (
                         <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-2xl bg-purple-600 text-white border border-white/20 flex items-center gap-2 shadow-xl">
                            <Clock className="w-3 h-3 fill-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{place.eta}</span>
                         </div>
                       )}
                    </div>

                    <div className="text-left flex-1 flex flex-col justify-between">
                       <div className="mb-4">
                          <h4 className="text-xl font-black text-white tracking-tight line-clamp-1 mb-1 group-hover:text-purple-300 transition-colors">{place.name}</h4>
                          <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1 text-amber-400">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[11px] font-black">{place.rating || '4.8'}</span>
                             </div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{distKm.toFixed(1)} km</span>
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex flex-col min-w-0">
                             <span className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[150px]">{place.address}</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg transition-all">
                             <Navigation className="w-5 h-5 fill-current" />
                          </div>
                       </div>
                    </div>
                  </button>
                );
             })}
             <div className="w-1 shrink-0" />
          </div>

          <div className="px-10 py-4 bg-slate-950 border-t border-white/5 flex items-center justify-between">
             <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">{places.length} Locations Identified</span>
             <span className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">NavPal Core v3.2</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default POISelectorGrid;
