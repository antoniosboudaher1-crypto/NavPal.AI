
import React, { useState } from 'react';
import { 
  Sun, ChevronDown, X, CloudRain, Cloud, CloudLightning, CloudSnow, Waves, Zap, Droplets, Wind
} from 'lucide-react';
import { Theme, TempUnit } from '../../types';

interface WeatherHUDProps {
  temperature?: number;
  condition?: string;
  high?: number;
  low?: number;
  humidity?: number;
  windSpeed?: number;
  uvIndex?: number;
  theme?: Theme;
  unit?: TempUnit;
  onToggleUnit?: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const WeatherHUD: React.FC<WeatherHUDProps> = ({
  temperature,
  condition = 'Clear',
  high,
  low,
  humidity,
  windSpeed,
  uvIndex,
  theme = 'dark',
  unit = 'F',
  onToggleUnit,
  isVisible,
  onToggleVisibility
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDark = theme === 'dark';

  const convertTemp = (temp?: number) => {
    if (temp === undefined) return '--';
    if (unit === 'F') return Math.round(temp);
    return Math.round((temp - 32) * 5 / 9);
  };

  const weatherConfig = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain')) return { icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20' };
    if (c.includes('snow')) return { icon: CloudSnow, color: 'text-indigo-200', bg: 'bg-indigo-500/10', glow: 'shadow-indigo-500/20' };
    if (c.includes('storm')) return { icon: CloudLightning, color: 'text-amber-300', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' };
    if (c.includes('cloud')) return { icon: Cloud, color: 'text-slate-300', bg: 'bg-slate-500/10', glow: 'shadow-slate-500/20' };
    if (c.includes('wind')) return { icon: Waves, color: 'text-cyan-300', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20' };
    return { icon: Sun, color: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' };
  };

  const config = weatherConfig(condition);
  const WeatherIcon = config.icon;

  // Discreet Mode: A single elegant trigger button that appears when the HUD is "hidden"
  if (!isVisible) {
    return (
      <button 
        onClick={onToggleVisibility}
        className={`pointer-events-auto w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-3xl border transition-all duration-500 active:scale-90 animate-zoom-in group ${
          isDark ? 'bg-slate-950/80 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-lg'
        }`}
        title="Show Weather"
      >
        <div className={`relative ${config.color} transition-transform group-hover:scale-110`}>
          <WeatherIcon className="w-7 h-7 drop-shadow-[0_0_8px_currentColor]" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse border-2 border-slate-950" />
        </div>
      </button>
    );
  }

  return (
    <div className="pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] animate-slide-in-left">
      <div className={`relative backdrop-blur-3xl border shadow-2xl rounded-[2.2rem] overflow-hidden transition-all duration-500 ${
        isDark ? 'bg-slate-950/85 border-white/10' : 'bg-white/95 border-slate-200 shadow-slate-300/50'
      } ${isExpanded ? 'w-[290px]' : 'w-[190px]'}`}>
        
        {/* Stage 1: Compact View */}
        <div 
          className="flex items-center justify-between px-4 h-16 cursor-pointer active:opacity-80 transition-opacity"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${config.bg} ${config.glow}`}>
              <WeatherIcon className={`w-6 h-6 ${config.color} drop-shadow-[0_0_5px_currentColor]`} />
            </div>
            
            <div className="flex flex-col leading-none">
              <div className="flex items-baseline gap-0.5">
                <span className={`text-2xl font-black tabular-nums tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {convertTemp(temperature)}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleUnit?.(); }}
                  className={`text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded hover:bg-indigo-500/10 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  °{unit}
                </button>
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.15em] truncate max-w-[70px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {condition}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
            <button 
               onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
               className={`p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors group ${isDark ? 'text-slate-600' : 'text-slate-300'}`}
               title="Minimize to icon"
            >
              <X className="w-4 h-4 group-hover:text-rose-500" />
            </button>
          </div>
        </div>

        {/* Stage 2: Tactical Details */}
        {isExpanded && (
          <div className="px-6 pb-6 pt-2 animate-fade-in space-y-5">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <DetailBox 
                label="H/L Range" 
                value={`${convertTemp(high)}° / ${convertTemp(low)}°`} 
                icon={<Sun className="w-3 h-3" />}
                isDark={isDark} 
              />
              <DetailBox 
                label="Humidity" 
                value={`${humidity}%`} 
                icon={<Droplets className="w-3 h-3" />}
                isDark={isDark} 
              />
              <DetailBox 
                label="Wind Speed" 
                value={`${windSpeed} mph`} 
                icon={<Wind className="w-3 h-3" />}
                isDark={isDark} 
              />
              <DetailBox 
                label="UV Index" 
                value={uvIndex ?? '--'} 
                icon={<Zap className="w-3 h-3" />}
                isDark={isDark} 
                accent={uvIndex && uvIndex > 5 ? 'text-rose-400' : 'text-emerald-400'} 
              />
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all active:scale-95 text-[9px] font-black uppercase tracking-[0.2em] ${
                isDark ? 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
              }`}
            >
               Minimize Interface
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailBox = ({ label, value, icon, isDark, accent }: { label: string, value: any, icon: React.ReactNode, isDark: boolean, accent?: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1.5 mb-1 opacity-50">
      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{icon}</span>
      <span className={`text-[7px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
    <span className={`text-sm font-black tabular-nums ${accent || (isDark ? 'text-slate-200' : 'text-slate-900')}`}>
      {value}
    </span>
  </div>
);

export default WeatherHUD;
