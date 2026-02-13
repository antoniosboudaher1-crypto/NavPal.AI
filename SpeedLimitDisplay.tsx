
import React, { useEffect, useState, useRef } from 'react';
import { SpeedUnit } from '../../types';

interface SpeedLimitDisplayProps {
  currentSpeed: number;
  speedLimit: number;
  warningsEnabled: boolean;
  theme?: 'dark' | 'light';
  unit?: SpeedUnit;
}

const SpeedLimitDisplay: React.FC<SpeedLimitDisplayProps> = ({ 
  currentSpeed, 
  speedLimit, 
  warningsEnabled,
  theme = 'dark',
  unit = 'MPH'
}) => {
  const isMPH = unit === 'MPH';
  
  // Internal values are KMH (standardized from services)
  const displayCurrent = isMPH ? Math.round(currentSpeed * 0.621371) : Math.round(currentSpeed);
  const displayLimit = isMPH ? Math.round(speedLimit * 0.621371) : Math.round(speedLimit);
  
  const isSpeeding = displayCurrent > displayLimit;
  const [pulse, setPulse] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastBeepTimeRef = useRef<number>(0);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isSpeeding) {
      const interval = setInterval(() => setPulse(p => !p), 800);
      const now = Date.now();
      if (warningsEnabled && now - lastBeepTimeRef.current > 15000) { 
          playWarningSound();
          lastBeepTimeRef.current = now;
      }
      return () => clearInterval(interval);
    } else {
      setPulse(false);
    }
  }, [isSpeeding, warningsEnabled]);

  const playWarningSound = () => {
      try {
        const AudioCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) audioCtxRef.current = new AudioCtor();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;
        
        // Gentle tactical harmonic warning
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, t); // Tactical tone
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.015, t + 0.05); 
        gainNode.gain.linearRampToValueAtTime(0, t + 0.3);
        oscillator.start(t);
        oscillator.stop(t + 0.3);
      } catch (e) {}
  };

  return (
    <div className={`pointer-events-auto flex flex-col items-center w-20 md:w-24 rounded-[2.5rem] backdrop-blur-3xl border transition-all duration-700 shadow-2xl overflow-hidden ${
      isSpeeding 
        ? 'bg-rose-950/90 border-rose-500 scale-105 shadow-rose-900/40 ring-4 ring-rose-500/20' 
        : (isDark ? 'bg-slate-950/80 border-white/10' : 'bg-white/95 border-slate-200 shadow-lg')
    }`}>
      {/* Current Speed Area */}
      <div className="flex flex-col items-center justify-center pt-6 pb-4">
         <div className="flex items-baseline gap-0.5 leading-none">
            <span className={`text-3xl md:text-4xl font-black tabular-nums tracking-tighter transition-colors duration-500 ${
              isSpeeding ? 'text-rose-400 animate-digital-flicker' : (isDark ? 'text-white' : 'text-slate-950')
            }`}>
                {displayCurrent}
            </span>
            <span className={`text-[7px] font-black uppercase tracking-widest ${isSpeeding ? 'text-rose-600' : 'text-slate-600'}`}>{isMPH ? 'MPH' : 'KMH'}</span>
         </div>
      </div>

      {/* Speed Limit "Sign" Area */}
      <div className={`w-full h-16 md:h-20 flex items-center justify-center transition-colors ${
        isSpeeding ? 'bg-rose-500/10' : 'bg-white/5'
      }`}>
        <div className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-[4px] transition-all duration-500 ${
          isSpeeding ? 'border-rose-600 scale-110 shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'border-slate-900'
        }`}>
            <span className="text-xl md:text-2xl font-black text-slate-950 tabular-nums tracking-tighter">
               {displayLimit}
            </span>
            {isSpeeding && pulse && (
               <div className="absolute -inset-1 rounded-full border-2 border-rose-500/40 animate-ping" />
            )}
        </div>
      </div>
      
      {/* Internal Scanning Glow */}
      {isSpeeding && (
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default SpeedLimitDisplay;
