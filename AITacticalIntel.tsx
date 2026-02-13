
import React from 'react';
import { TacticalIntel, Theme } from '../../types';
import GlassCard from '../UI/GlassCard';
import { ShieldCheck, Activity, Info, X } from 'lucide-react';

interface AITacticalIntelProps {
  intel: TacticalIntel;
  theme?: Theme;
  onClose?: () => void;
}

const AITacticalIntel: React.FC<AITacticalIntelProps> = ({ intel, onClose }) => {
  return (
    <div className="absolute left-6 bottom-52 md:bottom-64 z-[90] animate-slide-in-left pointer-events-auto">
      <GlassCard className="w-56 overflow-hidden border-t-2 bg-slate-950/95 border-purple-500/60 shadow-[0_20px_60px_rgba(88,28,135,0.4)] rounded-[2rem] p-0">
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-purple-900/10">
           <div className="flex items-center gap-2">
             <Activity className="w-4 h-4 text-purple-400" />
             <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Route Details</span>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-3 h-3 text-slate-500" /></button>
        </div>

        <div className="p-5 space-y-4">
           <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white leading-tight">{intel.status}</span>
           </div>

           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-cyan-400" />
                 <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Clear</span>
              </div>
              <span className="text-[10px] font-black text-purple-400 uppercase">{intel.eta}</span>
           </div>
        </div>

        <div className="h-1 w-full bg-slate-900 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-1/2 animate-[slideInRight_2s_linear_infinite]" />
        </div>
      </GlassCard>
    </div>
  );
};

export default AITacticalIntel;
