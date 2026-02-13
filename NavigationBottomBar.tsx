
import React, { useState, useEffect, useMemo } from 'react';
import { X, Share2, Clock, RefreshCw } from 'lucide-react';

interface NavigationBottomBarProps {
  remainingTime: number;
  remainingDistance: number;
  arrivalTime: string;
  onEndNavigation: () => void;
  onReport: () => void; 
  onShare?: () => void;
  onExpandChange?: (expanded: boolean) => void;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
  onReroute?: () => void;
}

const NavigationBottomBar: React.FC<NavigationBottomBarProps> = ({
  remainingTime,
  remainingDistance,
  onEndNavigation,
  onShare,
  onExpandChange,
  onReroute
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const liveArrivalTime = useMemo(() => {
    return new Date(now + remainingTime * 1000).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  }, [now, remainingTime]);

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

  return (
    <div className="w-full max-w-2xl mx-auto pointer-events-auto">
      <div 
        className={`relative bg-slate-950/90 border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all duration-700 ease-out overflow-hidden ${
          isExpanded ? 'h-64' : 'h-24'
        }`}
      >
        {/* Main Info Strip */}
        <div 
          className="px-8 h-24 flex items-center justify-between cursor-pointer active:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
           <div className="flex flex-col items-start w-24">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Time</span>
              <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                 {formatDuration(remainingTime)}
              </span>
           </div>

           <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                   <Clock className="w-3.5 h-3.5 text-purple-400" />
                   <span className="text-xl font-black text-white tabular-nums tracking-tighter">
                      {liveArrivalTime.split(' ')[0]}
                      <span className="text-[10px] ml-0.5 opacity-40 uppercase">{liveArrivalTime.split(' ')[1]}</span>
                   </span>
                </div>
                <div className={`w-8 h-1 rounded-full bg-slate-800 relative transition-all duration-500 ${isExpanded ? 'bg-purple-500 w-12' : ''}`}>
                    <div className="absolute inset-0 bg-white/5" />
                </div>
           </div>
           
           <div className="flex flex-col items-end w-24">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Left</span>
              <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
                {formatDistance(remainingDistance)}
              </span>
           </div>
        </div>

        {/* Action Tray */}
        {isExpanded && (
          <div className="px-8 pb-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in pt-8 border-t border-white/5">
            <button 
              onClick={(e) => { e.stopPropagation(); onReroute?.(); }}
              className="flex-1 min-w-[120px] h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center gap-3 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-[10px] font-black uppercase tracking-widest">Reroute</span>
            </button>

             <button 
              onClick={(e) => { e.stopPropagation(); onShare?.(); }}
              className="flex-1 min-w-[120px] h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-slate-300 hover:bg-white/10 transition-all active:scale-95 group"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); onEndNavigation(); }}
              className="flex-1 min-w-[120px] h-14 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span className="text-[10px] font-black uppercase tracking-widest">Stop trip</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBottomBar;
