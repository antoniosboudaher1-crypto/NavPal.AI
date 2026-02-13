
import React from 'react';
import { AppView, Theme, SpeedUnit } from '../../types';
import { Map, User, Search, LocateFixed } from 'lucide-react';

interface BottomBarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onMainAction: () => void;
  isMapCentered: boolean;
  currentSpeed: number;
  showSpeedometer: boolean;
  theme?: Theme;
  speedUnit?: SpeedUnit;
}

const BottomBar: React.FC<BottomBarProps> = ({ 
  currentView, 
  onViewChange, 
  onMainAction,
  isMapCentered,
  currentSpeed,
  showSpeedometer,
  theme = 'dark',
  speedUnit = 'MPH'
}) => {
  const isDark = theme === 'dark';
  
  // Calculate display speed based on unit (input currentSpeed is assumed to be in KM/H)
  const displaySpeed = speedUnit === 'MPH' 
    ? Math.round(currentSpeed * 0.621371) 
    : Math.round(currentSpeed);

  return (
    <div className="absolute bottom-10 left-0 right-0 z-40 flex justify-center pointer-events-auto px-6">
      <div className="flex flex-col items-center w-full max-w-[260px]">
        
        {/* Advanced Animated Speed HUD */}
        {showSpeedometer && (
          <div className={`backdrop-blur-3xl border rounded-xl px-5 py-2 mb-4 transition-all duration-700 shadow-xl animate-hud-pulse relative overflow-hidden group ${
            isDark ? 'bg-slate-950/75 border-white/10' : 'bg-white/95 border-slate-200 shadow-slate-300/50'
          }`}>
             {/* Scanning Glass Sweep Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent w-full animate-gloss-sweep pointer-events-none" />
             
             <div className="flex items-baseline gap-1.5 leading-none relative z-10 animate-digital-flicker">
                <span className={`text-2xl font-black tabular-nums tracking-tighter transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {displaySpeed}
                </span>
                <span className="text-[7px] font-black tracking-widest text-purple-500 uppercase">{speedUnit}</span>
             </div>
          </div>
        )}

        {/* Symmetrical Refined Dock */}
        <div className={`relative w-full h-16 flex items-center justify-between px-3 rounded-full border backdrop-blur-3xl transition-all duration-500 shadow-[0_30px_70px_rgba(0,0,0,0.7)] ${
          isDark 
            ? 'bg-slate-950/95 border-white/10' 
            : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          {/* Symmetrical Top Glow Accent */}
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          {/* Left: Map Mode (Symmetrical Weight) */}
          <button
            onClick={() => onViewChange(AppView.MAP)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
              currentView === AppView.MAP 
                ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Map className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {/* Center: Hero Action Button (Lower & Bigger) */}
          <div className="relative -top-2">
            <button 
              onClick={onMainAction}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 shadow-[0_15px_35px_rgba(0,0,0,0.8)] group border-[3px] ${
                !isMapCentered 
                  ? 'bg-purple-600 border-white shadow-[0_0_25px_rgba(168,85,247,0.7)]' 
                  : 'bg-purple-700 border-slate-950 shadow-[0_0_25px_rgba(168,85,247,0.6)]'
              }`}
            >
              {/* Internal Gloss Layer */}
              <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-25 pointer-events-none" />
              
              {!isMapCentered ? (
                <LocateFixed className="w-9 h-9 text-white animate-pulse" />
              ) : (
                <Search className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
              )}

              {/* Hover Glow Ring */}
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </button>
          </div>

          {/* Right: Profile Mode (Symmetrical Weight) */}
          <button
            onClick={() => onViewChange(AppView.PROFILE)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
              currentView === AppView.PROFILE 
                ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <User className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BottomBar;
