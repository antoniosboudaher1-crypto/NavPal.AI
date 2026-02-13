
import React, { useState } from 'react';
import { ReportType } from '../../types';
import GlassCard from '../UI/GlassCard';
import { Siren, CarFront, TriangleAlert, OctagonAlert, HardHat, CloudRain, ArrowLeft, X, Zap, ShieldAlert } from 'lucide-react';

interface ReportMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (type: ReportType | string) => void;
}

const ReportMenu: React.FC<ReportMenuProps> = ({ isOpen, onClose, onReport }) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportType | null>(null);

  if (!isOpen) return null;

  const categories = [
    {
      type: ReportType.TRAFFIC,
      label: 'Traffic',
      icon: <OctagonAlert className="w-8 h-8 text-white" />,
      color: 'from-yellow-500 to-yellow-700',
      subs: ['Heavy', 'Standstill']
    },
    {
      type: ReportType.POLICE,
      label: 'Police',
      icon: <Siren className="w-8 h-8 text-white" />,
      color: 'from-blue-600 to-blue-800',
      subs: ['Visible', 'Hidden']
    },
    {
      type: ReportType.ACCIDENT,
      label: 'Crash',
      icon: <CarFront className="w-8 h-8 text-white" />,
      color: 'from-red-600 to-red-800',
      subs: ['Minor', 'Major']
    },
    {
      type: ReportType.HAZARD,
      label: 'Hazard',
      icon: <TriangleAlert className="w-8 h-8 text-white" />,
      color: 'from-orange-500 to-orange-700',
      subs: ['On Road', 'Shoulder']
    },
    {
      type: ReportType.CONSTRUCTION,
      label: 'Work',
      icon: <HardHat className="w-8 h-8 text-white" />,
      color: 'from-amber-700 to-orange-900',
      subs: ['Roadwork', 'Closed']
    },
    {
      type: ReportType.WEATHER,
      label: 'Weather',
      icon: <CloudRain className="w-8 h-8 text-white" />,
      color: 'from-cyan-600 to-blue-700',
      subs: ['Rain', 'Fog', 'Ice']
    },
  ];

  const handleCategorySelect = (type: ReportType) => {
    setSelectedCategory(type);
  };

  const handleSubSelect = (sub: string) => {
    onReport(`${selectedCategory}:${sub}`);
    onClose();
    setSelectedCategory(null);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-[480px] animate-zoom-in">
        <GlassCard className="p-8 bg-[#0a0a0f]/95 border border-white/10 rounded-[3rem] overflow-hidden">
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-8 p-2 rounded-full bg-slate-900 text-slate-500 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {selectedCategory ? (
            <div className="animate-slide-in-right">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-purple-400 font-bold mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedCategory}</h3>
              </div>

              <div className="space-y-3">
                 {categories.find(c => c.type === selectedCategory)?.subs.map((sub, idx) => (
                   <button
                     key={sub}
                     onClick={() => handleSubSelect(sub)}
                     className="w-full flex items-center justify-between p-5 bg-white/[0.03] hover:bg-purple-600/20 border border-white/5 rounded-2xl transition-all group active:scale-[0.98]"
                   >
                     <span className="text-white font-bold text-lg">{sub}</span>
                     <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-slate-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <Zap className="w-4 h-4 fill-current" />
                     </div>
                   </button>
                 ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                   <ShieldAlert className="w-5 h-5 text-purple-400" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">What's up?</span>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Report an issue</h3>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.type}
                    onClick={() => handleCategorySelect(cat.type)}
                    className="group flex flex-col items-center gap-2 transition-transform active:scale-95"
                  >
                    <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ring-1 ring-white/10 bg-gradient-to-br ${cat.color} group-hover:scale-110`}>
                       <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                       <div className="relative z-10">
                         {cat.icon}
                       </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-white font-black text-[10px] tracking-widest uppercase transition-colors">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                 <button onClick={onClose} className="px-10 py-3 rounded-xl bg-white/5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white border border-white/5 transition-all">
                    Cancel
                 </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default ReportMenu;
