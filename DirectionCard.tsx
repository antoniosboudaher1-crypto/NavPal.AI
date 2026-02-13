
import React from 'react';
import { RouteStep, Theme } from '../../types';
import { ArrowUp, Flag, CornerUpLeft, CornerUpRight, ArrowUpLeft, ArrowUpRight, Undo2, RotateCw, Navigation, Sparkles } from 'lucide-react';

interface DirectionCardProps {
  step: RouteStep;
  distanceToNextStep: number;
  currentSpeed: number;
  theme?: Theme;
  isSpeaking?: boolean;
}

const getIconForManeuver = (type: string, modifier?: string, isApproaching: boolean = false) => {
  const lowerMod = modifier?.toLowerCase() || '';
  const lowerType = type.toLowerCase();
  
  const iconBaseClass = `text-white transition-all duration-700 ${isApproaching ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'scale-100'}`;
  const sizeClass = "w-8 h-8 md:w-10 md:h-10";
  const iconClass = `${sizeClass} ${iconBaseClass}`;

  if (lowerType === 'arrive') return <Flag className={iconClass} />;
  if (lowerType === 'depart') return <Navigation className={iconClass} />;
  if (lowerType.includes('rotary') || lowerType.includes('roundabout')) return <RotateCw className={iconClass} />;
  if (lowerType === 'uturn') return <Undo2 className={iconClass} />;
  
  if (lowerMod.includes('left')) {
     if (lowerMod.includes('slight')) return <ArrowUpLeft className={iconClass} />;
     return <CornerUpLeft className={iconClass} />;
  }
  if (lowerMod.includes('right')) {
     if (lowerMod.includes('slight')) return <ArrowUpRight className={iconClass} />;
     return <CornerUpRight className={iconClass} />;
  }
  return <ArrowUp className={iconClass} />;
};

const formatDistance = (meters: number) => {
  if (meters >= 1000) return { val: (meters / 1000).toFixed(1), unit: 'km' };
  return { val: Math.round(meters).toString(), unit: 'm' };
};

const DirectionCard: React.FC<DirectionCardProps> = ({ step, distanceToNextStep, isSpeaking }) => {
  const isImminent = distanceToNextStep < 150;
  const isApproaching = distanceToNextStep < 400;
  const dist = formatDistance(distanceToNextStep);

  return (
    <div className="w-full max-w-lg mx-auto pointer-events-auto">
      <div className={`relative flex items-center overflow-hidden rounded-[2.5rem] border transition-all duration-700 shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${
        isSpeaking 
          ? 'bg-purple-800 border-purple-400 neural-glow scale-[1.02]' 
          : isImminent 
            ? 'bg-purple-600 border-white/40 ring-4 ring-purple-600/20' 
            : 'bg-slate-950/80 border-white/10 backdrop-blur-3xl'
      }`}>
        
        {/* Left Icon Bay */}
        <div className={`w-20 md:w-24 h-24 flex items-center justify-center shrink-0 border-r border-white/5 ${
          isImminent || isSpeaking ? 'bg-white/10' : 'bg-slate-900/40'
        }`}>
          <div className={`relative z-10 ${isSpeaking ? 'animate-pulse' : ''}`}>
             {getIconForManeuver(step.maneuver.type, step.maneuver.modifier, isApproaching)}
          </div>
        </div>

        {/* Content Bay */}
        <div className="flex-1 flex flex-col justify-center px-6 py-4">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl md:text-4xl font-black tabular-nums tracking-tighter ${isImminent || isSpeaking ? 'text-white' : 'text-purple-400'}`}>
              {dist.val}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isImminent || isSpeaking ? 'text-purple-100' : 'text-slate-500'}`}>
              {dist.unit}
            </span>
          </div>
          
          <p className={`text-sm md:text-base font-bold line-clamp-1 tracking-tight mt-0.5 ${isImminent || isSpeaking ? 'text-white' : 'text-slate-200'}`}>
            {step.instruction.split(' onto ')[0]}
          </p>
        </div>

        {/* Right Status Pulse */}
        <div className={`w-3 h-full shrink-0 flex flex-col items-center justify-center gap-1 py-4 ${isImminent || isSpeaking ? 'bg-white/10' : 'bg-white/5'}`}>
           <div className={`w-1 h-3 rounded-full transition-all duration-500 ${isImminent || isSpeaking ? 'bg-white animate-pulse' : 'bg-slate-800'}`} />
           <div className={`w-1 h-6 rounded-full transition-all duration-500 ${isImminent || isSpeaking ? 'bg-white' : 'bg-purple-600/50'}`} />
           <div className={`w-1 h-3 rounded-full transition-all duration-500 ${isImminent || isSpeaking ? 'bg-white animate-pulse' : 'bg-slate-800'}`} />
        </div>

        {/* Visual Wavefront when AI is speaking */}
        {isSpeaking && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <div className="h-full bg-white w-1/4 animate-gloss-sweep shadow-[0_0_15px_white]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectionCard;
