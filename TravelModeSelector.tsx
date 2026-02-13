
import React from 'react';
import { TravelMode } from '../../types';
import GlassCard from '../UI/GlassCard';
import { Car, Bus, Footprints, Bike, X, Navigation, Sparkles, MoveRight } from 'lucide-react';

interface TravelModeSelectorProps {
  onSelect: (mode: TravelMode) => void;
  onCancel: () => void;
  destinationName?: string;
}

const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({ onSelect, onCancel, destinationName }) => {
  const modes: { id: TravelMode; label: string; icon: React.ReactNode; color: string; desc: string; anim: string }[] = [
    { 
      id: 'driving', 
      label: 'Drive', 
      icon: <Car className="w-6 h-6" />, 
      color: 'from-blue-600 to-indigo-700',
      desc: 'Fastest',
      anim: 'group-hover:animate-pulse'
    },
    { 
      id: 'transit', 
      label: 'Transit', 
      icon: <Bus className="w-6 h-6" />, 
      color: 'from-purple-600 to-fuchsia-700',
      desc: 'Public',
      anim: 'group-hover:animate-bounce'
    },
    { 
      id: 'walking', 
      label: 'Walk', 
      icon: <Footprints className="w-6 h-6" />, 
      color: 'from-emerald-600 to-teal-700',
      desc: 'Nearby',
      anim: 'group-hover:animate-bounce'
    },
    { 
      id: 'cycling', 
      label: 'Bike', 
      icon: <Bike className="w-6 h-6" />, 
      color: 'from-orange-600 to-amber-700',
      desc: 'Active',
      anim: 'group-hover:animate-pulse'
    }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-fade-in">
      <div className="absolute inset-0" onClick={onCancel} />
      
      <div className="relative w-full max-w-sm animate-zoom-in">
        <GlassCard className="overflow-hidden bg-[#050508]/98 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)] rounded-[3rem]">
          
          {/* Top Scan Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

          {/* Header Area */}
          <div className="p-6 pb-2 text-center relative z-10">
             <button 
                onClick={onCancel}
                className="absolute top-2 right-2 p-2.5 rounded-full bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90"
             >
                <X className="w-5 h-5" />
             </button>
             
             <div className="flex items-center justify-center mb-4">
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-1.5">
                   <Sparkles className="w-3 h-3 text-cyan-400" />
                   <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em]">Mode Select</span>
                </div>
             </div>
             
             <h2 className="text-2xl font-black text-white tracking-tight leading-none px-4">How are you getting there?</h2>
             <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest opacity-60 truncate px-6">
                {destinationName || 'Target Sector'}
             </p>
          </div>

          {/* Symmetrical Grid for Mobile */}
          <div className="p-5 grid grid-cols-2 gap-4 relative z-10">
             {modes.map((mode, idx) => (
                <button
                   key={mode.id}
                   onClick={() => onSelect(mode.id)}
                   className="group relative flex flex-col items-center justify-center p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-500 active:scale-[0.96] overflow-hidden"
                   style={{ animationDelay: `${idx * 50}ms` }}
                >
                   <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-500`} />
                   
                   <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-all duration-500 ring-1 ring-white/20`}>
                      <div className="text-white relative z-10">
                        {mode.icon}
                      </div>
                   </div>
                   
                   <span className="text-lg font-black text-white tracking-tight group-hover:text-cyan-100 transition-colors">{mode.label}</span>
                   <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-widest transition-colors">{mode.desc}</span>
                </button>
             ))}
          </div>

          {/* Footer Area */}
          <div className="px-6 py-6 border-t border-white/5 bg-slate-950/50 flex flex-col items-center gap-4 relative z-10">
             <div className="flex items-center gap-2 text-slate-700">
                <Navigation className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">NavPal Core Logic</span>
             </div>
             <button 
                onClick={onCancel}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 font-black text-[9px] uppercase tracking-[0.3em] transition-all border border-transparent hover:border-red-500/20"
             >
                Cancel
             </button>
          </div>
          
        </GlassCard>
      </div>
    </div>
  );
};

export default TravelModeSelector;
