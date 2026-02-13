
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface HudToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

const HudToggle: React.FC<HudToggleProps> = ({ isVisible, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className={`relative w-14 h-14 md:w-16 md:h-16 rounded-[1.75rem] backdrop-blur-3xl border flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 group z-50 overflow-hidden ${
        isVisible 
          ? 'bg-[#0a0a0f]/80 border-white/10 text-slate-400 hover:text-white' 
          : 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-900/30'
      }`}
      title={isVisible ? "Hide HUD" : "Deploy HUD"}
    >
      <div className="relative z-10">
        {isVisible ? (
           <Eye className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
        ) : (
           <EyeOff className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
        )}
      </div>
      
      {/* Background Pulse when Hidden (Stealth Mode Active) */}
      {!isVisible && (
         <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
      )}
    </button>
  );
};

export default HudToggle;
