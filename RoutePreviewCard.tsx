
import React, { useState } from 'react';
import { NavigationRoute, Place } from '../../types';
import GlassCard from '../UI/GlassCard';
import { 
  X, 
  MapPin, 
  Loader2, 
  BookmarkPlus,
  Tag,
  Navigation,
  Clock,
  Zap
} from 'lucide-react';

interface RoutePreviewCardProps {
  route: NavigationRoute;
  destination: Place | null;
  onStartNavigation: () => void;
  onCancel: () => void;
  onSave?: (place: Place) => void;
  isLoading?: boolean;
}

const RoutePreviewCard: React.FC<RoutePreviewCardProps> = ({ 
  route, 
  destination, 
  onStartNavigation, 
  onCancel,
  onSave,
  isLoading = false
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [customName, setCustomName] = useState(destination?.name || '');
  
  const hasValidRoute = route && route.duration > 0;

  const formatDuration = (seconds: number) => {
    const m = Math.floor((seconds % 3600) / 60);
    const h = Math.floor(seconds / 3600);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`;
    return `${Math.round(meters)}m`;
  };

  const handleConfirmSave = () => {
    if (onSave && destination) {
      onSave({ ...destination, name: customName });
      setIsSaving(false);
    }
  };

  const arrivalTime = new Date(Date.now() + (route?.duration || 0) * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="absolute bottom-6 left-0 right-0 z-[100] flex justify-center animate-slide-up pointer-events-none px-4">
      <div className="w-full max-md pointer-events-auto">
        <GlassCard className="overflow-hidden bg-[#0a0a0f]/98 border-t-2 border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.9)] rounded-[3rem]">
          
          <div className="w-full flex justify-center pt-4 pb-2 cursor-pointer" onClick={onCancel}>
            <div className="w-14 h-1.5 bg-white/10 rounded-full" />
          </div>

          <div className="px-8 pb-10 pt-4 flex flex-col items-center">
            
            <div className="mb-6 text-center w-full">
              <h2 className="text-2xl font-black text-white tracking-tighter leading-tight uppercase">
                {destination?.name || "Place"}
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 truncate px-4">
                {destination?.address || "Address"}
              </p>
            </div>

            {isLoading ? (
               <div className="mb-8 w-full h-24 flex flex-col items-center justify-center gap-4 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Searching</span>
               </div>
            ) : hasValidRoute && (
              <div className="mb-8 grid grid-cols-3 gap-3 w-full">
                 <StatPill label="Time" value={formatDuration(route.duration)} sub="Go" />
                 <StatPill label="Dist" value={formatDistance(route.distance)} sub="Total" />
                 <StatPill label="ETA" value={arrivalTime} sub="Arrive" />
              </div>
            )}

            {isSaving ? (
               <div className="w-full bg-slate-900/50 rounded-[2.5rem] p-6 border border-white/5 animate-slide-up">
                  <div className="flex items-center gap-2 mb-4 justify-center">
                     <Tag className="w-4 h-4 text-purple-400" />
                     <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Save</span>
                  </div>
                  <input 
                    autoFocus
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white text-center font-black outline-none focus:border-purple-500 mb-4"
                    placeholder="Name it..."
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setIsSaving(false)} className="py-4 rounded-2xl bg-white/5 text-slate-500 font-black text-[10px] uppercase">Back</button>
                     <button onClick={handleConfirmSave} className="py-4 rounded-2xl bg-purple-600 text-white font-black text-[10px] uppercase shadow-lg shadow-purple-900/40">Save</button>
                  </div>
               </div>
            ) : (
              <div className="w-full flex items-center gap-3">
                 <button onClick={onCancel} className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all active:scale-90 shadow-xl shrink-0">
                    <X className="w-6 h-6" />
                 </button>

                 <button 
                   onClick={onStartNavigation}
                   disabled={isLoading || !hasValidRoute}
                   className={`h-14 flex-1 rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.96] ${isLoading || !hasValidRoute ? 'bg-slate-900 opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:brightness-110 text-white border-t border-white/20'}`}
                 >
                    <Navigation className="w-4 h-4 fill-current" />
                    <span className="font-black text-xs uppercase tracking-[0.2em]">Start</span>
                 </button>

                 <button onClick={() => setIsSaving(true)} className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-purple-400 transition-all active:scale-90 shadow-xl shrink-0">
                    <BookmarkPlus className="w-6 h-6" />
                 </button>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const StatPill = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex flex-col items-center">
     <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</span>
     <span className="text-xl font-black text-white tracking-tighter leading-none">{value.replace(/[a-z]/g, '')}</span>
     <span className="text-[8px] font-black text-purple-400 uppercase tracking-[0.2em] mt-1">{sub}</span>
  </div>
);

export default RoutePreviewCard;
