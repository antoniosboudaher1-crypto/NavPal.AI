
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { 
  Shield, 
  Crown, 
  Check, 
  Zap, 
  X,
  Sparkles,
  Trophy,
  Ban,
  Car,
  User as UserIcon,
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface SubscriptionWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  isNavigating?: boolean;
  onStopNavigation?: () => void;
}

const STORAGE_KEY = 'navpal_sub_details';
const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Supercar', 'Bike'];

const SubscriptionWidget: React.FC<SubscriptionWidgetProps> = ({ 
  isOpen, 
  onClose, 
  isNavigating, 
  onStopNavigation 
}) => {
  const [activeTier, setActiveTier] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setActiveTier(parsed.tier);
          setCustomName(parsed.name || '');
          setVehicleType(parsed.vehicle || 'Sedan');
        }
      } catch (e) {
        console.warn("Storage access denied");
      }
    }
  }, [isOpen]);

  const handleSave = (tier: string) => {
    setActiveTier(tier);
    const data = { tier, name: customName, vehicle: vehicleType };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
    setIsEditing(null);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-in-left touch-none">
      <GlassCard className="overflow-hidden bg-[#0a0a0f]/98 border-t-2 border-purple-500/60 shadow-[0_20px_80px_rgba(0,0,0,0.9)] rounded-[2.5rem] flex flex-col max-h-[80vh]">
        
        {/* Mobile Tactile Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-white/10 rounded-full" />
        </div>

        {/* Symmetrical Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/40 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.9)]" />
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Upgrade Center</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all active:scale-90 border border-white/5 relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain touch-pan-y p-6 space-y-6">
          
          {/* Mission Control (If active) */}
          {isNavigating && (
            <div className="p-5 rounded-[2rem] bg-red-950/20 border border-red-500/30 animate-pulse">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Active Trip Detected</span>
                  </div>
               </div>
               <button 
                onClick={() => {
                  onStopNavigation?.();
                  onClose();
                }}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 <Ban className="w-4 h-4" />
                 Abort Current Mission
               </button>
            </div>
          )}

          {/* Silver Tier Card */}
          <div className={`relative flex flex-col p-6 rounded-[2rem] border transition-all duration-500 ${
            activeTier === 'silver' 
              ? 'bg-slate-800/60 border-slate-400 shadow-[0_0_30px_rgba(148,163,184,0.15)]' 
              : 'bg-white/[0.02] border-white/5 hover:border-white/20'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-slate-950 border flex items-center justify-center ${activeTier === 'silver' ? 'border-slate-400' : 'border-slate-800'}`}>
                  <Shield className={`w-6 h-6 ${activeTier === 'silver' ? 'text-slate-200' : 'text-slate-600'}`} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest leading-none mb-1">Silver Plan</h3>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Standard Access</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-black text-slate-100 tabular-nums tracking-tighter">$4.99</span>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">/ Month</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <FeatureItem text="Enhanced Map Layers" active={activeTier === 'silver'} />
              <FeatureItem text="Live Traffic Reporting" active={activeTier === 'silver'} />
              <FeatureItem text="Basic Voice Control" active={activeTier === 'silver'} />
            </div>

            {isEditing === 'silver' ? (
              <div className="space-y-4 pt-4 border-t border-white/5 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Custom Pilot ID</label>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter callsign..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-slate-400 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle Signature</label>
                  <div className="flex flex-wrap gap-2">
                    {VEHICLE_TYPES.map(type => (
                      <button 
                        key={type}
                        onClick={() => setVehicleType(type)}
                        className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase transition-all border ${vehicleType === type ? 'bg-slate-200 text-slate-900 border-slate-200' : 'bg-white/5 text-slate-500 border-transparent hover:text-slate-300'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => handleSave('silver')}
                  className="w-full py-4 bg-slate-200 hover:bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl"
                >
                  Activate Signature
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing('silver')}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border flex items-center justify-center gap-2 ${
                  activeTier === 'silver' 
                    ? 'bg-slate-200 text-slate-900 border-slate-200 shadow-lg' 
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                {activeTier === 'silver' ? <Check className="w-4 h-4" /> : null}
                {activeTier === 'silver' ? 'Modify Logic' : 'Initiate Link'}
              </button>
            )}
          </div>

          {/* Gold Tier Card */}
          <div className={`relative flex flex-col p-6 rounded-[2.5rem] border transition-all duration-500 overflow-hidden group ${
            activeTier === 'gold' 
              ? 'bg-amber-950/30 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.25)]' 
              : 'bg-amber-900/5 border-amber-900/20 hover:border-amber-500/50'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="absolute top-0 right-0 bg-amber-500 px-5 py-2 rounded-bl-[1.5rem] shadow-lg border-l border-b border-amber-400/30 flex items-center gap-2">
               <Sparkles className="w-3 h-3 text-amber-950 fill-amber-950" />
               <span className="text-[9px] font-black text-amber-950 uppercase tracking-widest">Elite Grid</span>
            </div>

            <div className="flex justify-between items-start mb-6 pt-2">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-slate-950 border flex items-center justify-center ${activeTier === 'gold' ? 'border-amber-400' : 'border-amber-900/50'}`}>
                  <Crown className={`w-6 h-6 ${activeTier === 'gold' ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-amber-900'}`} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-100 uppercase tracking-widest leading-none mb-1">Gold Plan</h3>
                  <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Ultimate Sync</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-3xl font-black text-amber-400 tabular-nums tracking-tighter drop-shadow-md">$8.99</span>
                <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">/ Month</span>
              </div>
            </div>

            <div className="space-y-2.5 mb-6">
              <FeatureItem text="Pro AI Tactical Guide" active={activeTier === 'gold'} gold />
              <FeatureItem text="3D Grid Projection" active={activeTier === 'gold'} gold />
              <FeatureItem text="Premium Voice Profiles" active={activeTier === 'gold'} gold />
              <FeatureItem text="Priority Server Link" active={activeTier === 'gold'} gold />
            </div>

            {isEditing === 'gold' ? (
              <div className="space-y-4 pt-4 border-t border-amber-500/20 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest ml-1">Custom Pilot ID</label>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter pilot name..."
                    className="w-full bg-[#0a0a0f] border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-100 focus:border-amber-400 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest ml-1">Vehicle Signature</label>
                  <div className="flex flex-wrap gap-2">
                    {VEHICLE_TYPES.map(type => (
                      <button 
                        key={type}
                        onClick={() => setVehicleType(type)}
                        className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase transition-all border ${vehicleType === type ? 'bg-amber-500 text-amber-950 border-amber-500' : 'bg-white/5 text-amber-700 border-transparent hover:text-amber-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => handleSave('gold')}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95"
                >
                  Confirm Elite Link
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing('gold')}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border flex items-center justify-center gap-2 ${
                  activeTier === 'gold' 
                    ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-xl' 
                    : 'bg-white/5 text-amber-600 border-amber-900/50 hover:border-amber-500/50'
                }`}
              >
                {activeTier === 'gold' ? <Check className="w-4 h-4" /> : null}
                {activeTier === 'gold' ? 'Reconfigure Core' : 'Go Elite'}
              </button>
            )}

            {activeTier === 'gold' && !isEditing && (
              <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center justify-between animate-fade-in">
                 <div className="flex flex-col">
                   <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Pilot: {customName || 'Awaiting ID'}</span>
                   <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Vehicle: {vehicleType}</span>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500" />
                 </div>
              </div>
            )}
          </div>

          {/* Bottom Space for easier scrolling reach */}
          <div className="h-8" />
        </div>

        {/* Footer Area */}
        <div className="shrink-0 flex flex-col">
          {/* Dynamic Scanning Accent */}
          <div className="h-[2px] w-full bg-purple-500/10 overflow-hidden">
             <div className="h-full bg-purple-400 animate-[slideInRight_4s_linear_infinite] w-1/4 shadow-[0_0_10px_rgba(168,85,247,1)]" />
          </div>

          <div className="px-8 py-5 border-t border-white/5 bg-slate-950 flex items-center justify-between">
             <ShieldCheck className="w-4 h-4 text-slate-800" />
             <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Safe Protocol</span>
               <span className="text-[7px] font-bold text-slate-800 uppercase tracking-widest mt-0.5">Secure Transaction</span>
             </div>
             <Lock className="w-4 h-4 text-slate-800" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const FeatureItem = ({ text, active, gold }: { text: string, active: boolean, gold?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-300 ${
      active 
        ? (gold ? 'bg-amber-500 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-slate-300 border-slate-200') 
        : 'border-slate-800'
    }`}>
      {active && <Check className={`w-2.5 h-2.5 ${gold ? 'text-amber-950' : 'text-slate-900'}`} strokeWidth={4} />}
    </div>
    <span className={`text-xs font-bold transition-colors ${
      active 
        ? (gold ? 'text-amber-100' : 'text-slate-100') 
        : 'text-slate-700'
    }`}>
      {text}
    </span>
  </div>
);

export default SubscriptionWidget;
