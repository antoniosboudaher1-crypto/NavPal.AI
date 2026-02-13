
import React, { useState, useEffect } from 'react';
import { RouteOptions } from '../../types';
import GlassCard from '../UI/GlassCard';
import { Settings2, X, Zap, Ban, Car, Timer } from 'lucide-react';

interface RouteOptionsMenuProps {
  isOpen: boolean;
  options: RouteOptions;
  onChange: (newOptions: RouteOptions) => void;
  onClose: () => void;
}

const RouteOptionsMenu: React.FC<RouteOptionsMenuProps> = ({ isOpen, options, onChange, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  // Handle appear/disappear animation lifecycle
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure the browser registers the change from 'none' to 'flex' before animating
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // Matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleToggle = (key: keyof RouteOptions) => {
    if (key === 'preference') {
       onChange({ ...options, preference: options.preference === 'fastest' ? 'shortest' : 'fastest' });
    } else {
       onChange({ ...options, [key]: !options[key] });
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`absolute bottom-52 right-20 z-[60] origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
      }`}
    >
      <GlassCard className="w-72 bg-slate-900/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-[2rem] p-0 overflow-hidden">
         {/* Header */}
         <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-800/30">
            <div className="flex items-center gap-2 text-white font-bold">
               <Settings2 className="w-5 h-5 text-purple-400" />
               <span className="text-sm tracking-tight">Route Options</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
               <X className="w-5 h-5" />
            </button>
         </div>

         <div className="p-5 space-y-6">
             {/* Preference Selector */}
             <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Priority Strategy</span>
                <div className="flex bg-slate-950/80 rounded-xl p-1 border border-white/5">
                   <button 
                     onClick={() => onChange({ ...options, preference: 'fastest' })}
                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${options.preference === 'fastest' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     <Zap className="w-4 h-4 fill-current" />
                     Fastest
                   </button>
                   <button 
                     onClick={() => onChange({ ...options, preference: 'shortest' })}
                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${options.preference === 'shortest' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     <Timer className="w-4 h-4" />
                     Shortest
                   </button>
                </div>
             </div>

             <div className="h-px bg-white/5" />

             {/* Avoid Toggles */}
             <div className="space-y-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Exclusion Filters</span>
                 
                 <button 
                   onClick={() => handleToggle('avoidTolls')}
                   className="w-full flex items-center justify-between group"
                 >
                    <div className="flex items-center gap-3">
                       <div className={`p-2.5 rounded-xl transition-colors ${options.avoidTolls ? 'bg-red-500/20 text-red-400' : 'bg-slate-800/50 text-slate-500'}`}>
                          <Ban className="w-4 h-4" />
                       </div>
                       <span className={`text-xs font-bold transition-colors ${options.avoidTolls ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                          Avoid Tolls
                       </span>
                    </div>
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${options.avoidTolls ? 'bg-red-600' : 'bg-slate-700'}`}>
                       <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${options.avoidTolls ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                 </button>

                 <button 
                   onClick={() => handleToggle('avoidHighways')}
                   className="w-full flex items-center justify-between group"
                 >
                    <div className="flex items-center gap-3">
                       <div className={`p-2.5 rounded-xl transition-colors ${options.avoidHighways ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800/50 text-slate-500'}`}>
                          <Car className="w-4 h-4" />
                       </div>
                       <span className={`text-xs font-bold transition-colors ${options.avoidHighways ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                          Avoid Highways
                       </span>
                    </div>
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${options.avoidHighways ? 'bg-orange-500' : 'bg-slate-700'}`}>
                       <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${options.avoidHighways ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                 </button>
             </div>
         </div>
         
         <div className="bg-white/[0.02] p-4 text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest border-t border-white/5">
           MyPal Logic Engine v2.5
         </div>
      </GlassCard>
    </div>
  );
};

export default RouteOptionsMenu;
