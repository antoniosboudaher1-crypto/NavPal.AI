
import React from 'react';
import { Gauge, X, TriangleAlert, Car } from 'lucide-react';
import GlassCard from '../UI/GlassCard';

interface DriveModeDashboardProps {
  currentSpeed: number;
  onExit: () => void;
  onReport: () => void;
}

const DriveModeDashboard: React.FC<DriveModeDashboardProps> = ({
  currentSpeed,
  onExit,
  onReport
}) => {
  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none flex flex-col justify-between p-4 z-40">
      
      {/* Top Info: Free Drive Status */}
      <div className="flex justify-center pointer-events-auto mt-4">
        <GlassCard className="px-6 py-3 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3 shadow-2xl">
           <Car className="w-5 h-5 text-green-400 animate-pulse" />
           <span className="text-white font-bold tracking-wider text-sm">DRIVE MODE ACTIVE</span>
        </GlassCard>
      </div>

      {/* Bottom Controls: Speed & Actions */}
      <div className="flex items-end justify-center pointer-events-auto mb-6">
        <GlassCard className="flex items-center gap-6 p-2 bg-slate-950/80 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl">
          
          {/* Speedometer */}
          <div className="w-24 h-24 bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-inner">
             <span className="text-4xl font-bold text-white tracking-tighter">{Math.round(currentSpeed)}</span>
             <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">km/h</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pr-4">
             {/* Report Button */}
             <button 
               onClick={onReport}
               className="w-16 h-16 rounded-2xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/50 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 duration-200"
             >
               <TriangleAlert className="w-6 h-6" />
               <span className="text-[10px] font-bold">Report</span>
             </button>

             {/* Exit Button */}
             <button 
               onClick={onExit}
               className="h-16 px-6 rounded-2xl bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white font-bold border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 duration-200 group"
             >
               <X className="w-6 h-6" />
               <span className="text-sm">Exit</span>
             </button>
          </div>

        </GlassCard>
      </div>

    </div>
  );
};

export default DriveModeDashboard;
