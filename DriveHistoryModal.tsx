
import React from 'react';
import { DriveHistory } from '../../types';
import GlassCard from '../UI/GlassCard';
import { X, History, MapPin, Calendar, Trash2, Clock, Navigation } from 'lucide-react';

interface DriveHistoryModalProps {
  history: DriveHistory[];
  onClose: () => void;
  onClear: () => void;
  onSelectRoute: (history: DriveHistory) => void;
}

const DriveHistoryModal: React.FC<DriveHistoryModalProps> = ({ 
  history, 
  onClose, 
  onClear,
  onSelectRoute
}) => {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${h}h ${remM}m`;
    }
    return `${m} min`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl animate-zoom-in">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap bg-slate-900/50 backdrop-blur px-6 py-2 rounded-full border border-white/5">
           <History className="w-5 h-5 text-slate-400" />
           <span className="text-xl font-black text-white uppercase tracking-tighter">Drive History</span>
        </div>

        <GlassCard className="relative w-full max-h-[75vh] flex flex-col bg-[#0a0a0f]/95 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden">
          {/* List Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Recent Missions</span>
             <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <button 
                    onClick={onClear}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button onClick={onClose} className="p-2 text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
             </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4 opacity-30">
                 <History className="w-16 h-16" />
                 <p className="font-black text-sm uppercase tracking-widest">No Sector Data</p>
              </div>
            ) : (
              history.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectRoute(item)}
                  className="w-full bg-slate-900/30 hover:bg-slate-900/60 border border-white/5 hover:border-purple-500/30 rounded-3xl p-6 flex flex-col gap-5 transition-all group active:scale-[0.98] relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                     <div className="flex-1 min-w-0 text-left">
                        <h3 className="text-2xl font-black text-white tracking-tight mb-1">{item.destinationName}</h3>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                           <MapPin className="w-3 h-3 text-slate-600" />
                           <span className="font-bold">{item.destinationAddress}</span>
                        </div>
                     </div>
                     <div className="bg-slate-950/80 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-300 uppercase">{formatDate(item.timestamp)}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-950/60 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400">
                           <Clock className="w-5 h-5" />
                        </div>
                        <div className="text-left leading-none">
                           <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Time</span>
                           <span className="text-lg font-black text-white">{formatDuration(item.duration)}</span>
                        </div>
                     </div>
                     <div className="bg-slate-950/60 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                           <Navigation className="w-5 h-5" />
                        </div>
                        <div className="text-left leading-none">
                           <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Distance</span>
                           <span className="text-lg font-black text-white">{formatDistance(item.distance)}</span>
                        </div>
                     </div>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="p-4 bg-slate-950/50 border-t border-white/5 flex justify-center">
             <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Tactical Record Store</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DriveHistoryModal;
