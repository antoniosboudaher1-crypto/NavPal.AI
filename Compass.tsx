
import React from 'react';

interface CompassProps {
  bearing: number;
  onReset?: () => void;
  className?: string;
}

const Compass: React.FC<CompassProps> = ({ bearing, onReset, className = '' }) => {
  return (
    <button 
      onClick={onReset}
      className={`group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/10 shadow-2xl active:scale-90 transition-all duration-300 pointer-events-auto ${className}`}
      title="Reset North"
    >
      {/* Outer Static Ring */}
      <div className="absolute inset-[4px] border border-white/5 rounded-full" />
      
      {/* Central Tactical Node */}
      <div className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)] z-20" />
      
      {/* Rotating Dial */}
      <div 
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${-bearing}deg)` }}
      >
        {/* Cardinal Markers */}
        <div className="absolute top-1.5 flex flex-col items-center">
          <div className="w-0.5 h-2 bg-purple-500 rounded-full mb-0.5" />
          <span className="text-[10px] font-black text-white tracking-tighter">N</span>
        </div>
        
        <div className="absolute bottom-1.5 flex flex-col items-center">
          <span className="text-[8px] font-bold text-slate-600 tracking-tighter mb-0.5">S</span>
          <div className="w-0.5 h-1.5 bg-slate-800 rounded-full" />
        </div>
        
        <div className="absolute left-1.5 flex items-center">
          <div className="w-1.5 h-0.5 bg-slate-800 rounded-full mr-0.5" />
          <span className="text-[8px] font-bold text-slate-600 tracking-tighter">W</span>
        </div>
        
        <div className="absolute right-1.5 flex items-center">
          <span className="text-[8px] font-bold text-slate-600 tracking-tighter ml-0.5">E</span>
          <div className="w-1.5 h-0.5 bg-slate-800 rounded-full ml-0.5" />
        </div>

        {/* Diagonal Crosshair Dots */}
        <div className="absolute top-[28%] left-[28%] w-0.5 h-0.5 bg-slate-800 rounded-full" />
        <div className="absolute top-[28%] right-[28%] w-0.5 h-0.5 bg-slate-800 rounded-full" />
        <div className="absolute bottom-[28%] left-[28%] w-0.5 h-0.5 bg-slate-800 rounded-full" />
        <div className="absolute bottom-[28%] right-[28%] w-0.5 h-0.5 bg-slate-800 rounded-full" />
      </div>
      
      {/* Subtle Scan Highlight */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default Compass;
