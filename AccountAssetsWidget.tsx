
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { 
  Shield, 
  Zap, 
  Check, 
  Crown, 
  Lock, 
  ShoppingCart, 
  Package, 
  Clock, 
  CreditCard, 
  X, 
  ShieldCheck, 
  Star,
  Receipt,
  LayoutGrid,
  History
} from 'lucide-react';

interface AccountAssetsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'subscriptions' | 'purchases';
}

const SUB_STORAGE_KEY = 'navpal_subscription';

const AccountAssetsWidget: React.FC<AccountAssetsWidgetProps> = ({ isOpen, onClose, initialTab = 'subscriptions' }) => {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'purchases'>(initialTab);
  const [activeTier, setActiveTier] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const saved = localStorage.getItem(SUB_STORAGE_KEY);
    if (saved) setActiveTier(saved);
  }, []);

  const handleSelectTier = (tier: string) => {
    setActiveTier(tier);
    localStorage.setItem(SUB_STORAGE_KEY, tier);
  };

  const purchases = [
    { id: 'p1', name: 'Charon Elite Voice', type: 'Voice Mod', status: 'Active', date: '2024-05-20', cost: '$4.99' },
    { id: 'p2', name: 'Nighthawk Map Skin', type: 'HUD Skin', status: 'Acquired', date: '2024-05-18', cost: '$2.99' },
    { id: 'p3', name: 'Offline Grid Pack', type: 'Data', status: 'Syncing', date: '2024-05-15', cost: '$0.00' }
  ];

  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-in-right">
      <GlassCard className="overflow-hidden bg-[#0a0a0f]/98 border-t-2 border-cyan-500 shadow-[0_20px_80px_rgba(6,182,212,0.3)] rounded-[2.5rem]">
        {/* Unified Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] ml-1">Asset Control</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 pb-0 flex gap-2">
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'subscriptions' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-slate-500 border border-transparent hover:bg-white/10'}`}
          >
            <Crown className="w-3.5 h-3.5" />
            Subscriptions
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'purchases' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-slate-500 border border-transparent hover:bg-white/10'}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Purchases
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto no-scrollbar custom-scrollbar">
          {activeTab === 'subscriptions' ? (
            <div className="space-y-4 animate-fade-in">
              {/* Silver Tier */}
              <div className={`p-5 rounded-3xl transition-all duration-500 border ${activeTier === 'silver' ? 'bg-slate-800/80 border-slate-300' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${activeTier === 'silver' ? 'text-slate-200' : 'text-slate-600'}`} />
                    <div>
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Sentinel Silver</h3>
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">$9/MO</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSelectTier('silver')}
                    className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${activeTier === 'silver' ? 'bg-slate-200 text-slate-900' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'}`}
                  >
                    {activeTier === 'silver' ? 'Active' : 'Select'}
                  </button>
                </div>
                <div className="space-y-1.5">
                   <FeatureItem text="Tactical HUD" active={activeTier === 'silver'} />
                   <FeatureItem text="Community Grid" active={activeTier === 'silver'} />
                </div>
              </div>

              {/* Gold Tier */}
              <div className={`p-5 rounded-3xl transition-all duration-500 border relative ${activeTier === 'gold' ? 'bg-amber-950/20 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'bg-white/[0.02] border-white/5'}`}>
                {activeTier === 'gold' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500 px-2 py-0.5 rounded-full">
                    <Star className="w-2 h-2 text-amber-950 fill-amber-950" />
                    <span className="text-[6px] font-black text-amber-950 uppercase tracking-widest">Premium</span>
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Crown className={`w-5 h-5 ${activeTier === 'gold' ? 'text-amber-400' : 'text-amber-900'}`} />
                    <div>
                      <h3 className="text-xs font-black text-amber-100 uppercase tracking-widest">Sentinel Gold</h3>
                      <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-tighter">$24/MO</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSelectTier('gold')}
                    className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${activeTier === 'gold' ? 'bg-amber-500 text-amber-950' : 'bg-white/5 text-amber-600 hover:text-amber-100 border border-amber-900/50'}`}
                  >
                    {activeTier === 'gold' ? 'Active' : 'Select'}
                  </button>
                </div>
                <div className="space-y-1.5">
                   <FeatureItem text="Priority AI Copilot" active={activeTier === 'gold'} gold />
                   <FeatureItem text="3D Grid Projection" active={activeTier === 'gold'} gold />
                   <FeatureItem text="Zero-Latency Voice" active={activeTier === 'gold'} gold />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 animate-fade-in">
              {purchases.map((item) => (
                <div key={item.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/50 transition-colors">
                      {item.type === 'Voice Mod' ? <Cpu className="w-5 h-5 text-cyan-400" /> : <Package className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-slate-200 uppercase tracking-tight">{item.name}</span>
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">{item.type} • {item.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-black text-white">{item.cost}</span>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {item.status === 'Active' ? <Check className="w-2 h-2 text-green-500" /> : <Clock className="w-2 h-2 text-yellow-500" />}
                      <span className={`text-[7px] font-black uppercase ${item.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>{item.status}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-cyan-400" />
                   <span className="text-[9px] font-black text-cyan-200 uppercase">Acquisition Protection Enabled</span>
                </div>
                <Receipt className="w-3 h-3 text-cyan-400/50" />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Scanning Accent */}
        <div className="h-[2px] w-full bg-cyan-500/10 overflow-hidden">
           <div className={`h-full bg-cyan-400/50 animate-[slideInRight_3s_linear_infinite] ${activeTab === 'subscriptions' ? 'w-1/2' : 'w-1/4'}`} />
        </div>

        {/* Symmetrical Footer */}
        <div className="px-5 py-3 border-t border-white/5 bg-slate-950 flex items-center justify-between">
           <LayoutGrid className="w-3 h-3 text-slate-800" />
           <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.4em]">Tactical Account Assets Linked</span>
           <History className="w-3 h-3 text-slate-800" />
        </div>
      </GlassCard>
    </div>
  );
};

const FeatureItem = ({ text, active, gold }: { text: string, active: boolean, gold?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${active ? (gold ? 'bg-amber-500 border-amber-400' : 'bg-slate-300 border-slate-200') : 'border-slate-800'}`}>
      {active && <Check className={`w-2 h-2 ${gold ? 'text-amber-950' : 'text-slate-900'}`} strokeWidth={4} />}
    </div>
    <span className={`text-[8px] font-bold uppercase tracking-tight ${active ? (gold ? 'text-amber-200' : 'text-slate-200') : 'text-slate-700'}`}>{text}</span>
  </div>
);

const Cpu = (props: any) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
  </svg>
);

export default AccountAssetsWidget;
