
import React, { useState, useEffect } from 'react';
import { Crown, Shield, Check, Zap, Sparkles, Navigation, ArrowRight, ShieldCheck, Lock, X, Radio, Activity } from 'lucide-react';
import GlassCard from '../UI/GlassCard';

interface SubscriptionOnboardingProps {
  onComplete: (tier: string) => void;
  userName: string;
}

const SubscriptionOnboarding: React.FC<SubscriptionOnboardingProps> = ({ onComplete, userName }) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const tiers = [
    {
      id: 'silver',
      name: 'Silver',
      price: '4.99',
      sub: 'Smart Essentials',
      color: 'from-slate-400 to-indigo-500',
      glow: 'rgba(99, 102, 241, 0.2)',
      border: 'border-indigo-500/30',
      icon: <Shield className="w-8 h-8 text-indigo-300" />,
      tagline: "Perfect for your daily commute",
      features: [
        'Real-time Traffic',
        'Speed Trap Alerts',
        'Custom Voices',
        'Unlimited Saved Places'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '8.99',
      sub: 'Ultimate AI',
      color: 'from-amber-400 to-orange-600',
      glow: 'rgba(245, 158, 11, 0.25)',
      border: 'border-amber-500/50',
      icon: <Crown className="w-8 h-8 text-amber-400" />,
      popular: true,
      tagline: "Unlock the full power of Gemini",
      features: [
        'Advanced AI Assistant',
        'Predictive Routing',
        'Immersive 3D Maps',
        'VIP Profile Badge'
      ]
    }
  ];

  const handleActivate = () => {
    if (selectedTier) {
      onComplete(selectedTier);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center overflow-y-auto no-scrollbar py-12 px-6 select-none">
      
      {/* Dynamic Tactical Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[140px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[140px] rounded-full animate-pulse-slow delay-1000" />
        
        {/* Subtle Moving Grid */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      <div className={`relative z-10 w-full max-w-5xl flex flex-col items-center transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* Skip Action - Immediate Access */}
        <div className="absolute top-0 right-0 z-50">
          <button 
            onClick={() => onComplete('basic')}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-95 hover:bg-slate-800 shadow-lg"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Skip</span>
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-indigo-600 blur-3xl opacity-20 animate-pulse group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] mx-auto border border-white/10 transform hover:scale-105 transition-transform duration-500">
              <Navigation className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Welcome aboard, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-black uppercase tracking-[0.4em] max-w-lg mx-auto">
              Choose your plan
            </p>
          </div>
        </div>

        {/* Symmetrical Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mb-16">
          {tiers.map((tier, idx) => {
            const isSelected = selectedTier === tier.id;
            
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`group relative text-left transition-all duration-700 animate-zoom-in cursor-pointer h-full ${
                  isSelected ? 'scale-[1.03] z-10' : 'hover:scale-[1.01] z-0'
                }`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-amber-950 text-[11px] font-black uppercase tracking-[0.3em] px-8 py-2 rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.4)] flex items-center gap-2 border border-amber-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-950 animate-pulse" />
                    Recommended
                  </div>
                )}

                <div className={`relative h-full p-1 rounded-[3.5rem] transition-all duration-700 ${
                  isSelected ? `bg-gradient-to-br ${tier.color}` : 'bg-white/5 hover:bg-white/10'
                }`}>
                  <GlassCard className={`h-full p-10 rounded-[3.25rem] border-0 transition-all duration-500 overflow-hidden flex flex-col relative ${
                    isSelected ? 'bg-slate-950/95' : 'bg-[#0a0a0f]/80'
                  }`}>
                    
                    {/* Price & Icon Header */}
                    <div className="flex justify-between items-center mb-10 relative z-10">
                      <div className={`w-20 h-20 rounded-[2rem] bg-slate-900 border flex items-center justify-center transition-all duration-700 ${
                        isSelected ? tier.border : 'border-white/5'
                      }`}>
                        <div className={`${isSelected ? 'animate-pulse' : ''}`}>{tier.icon}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-black tracking-tighter leading-none transition-colors duration-500 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          <span className="text-sm align-top mr-1 opacity-60">$</span>{tier.price}
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Per Month</div>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="mb-10 relative z-10">
                      <h3 className={`text-3xl font-black uppercase tracking-tight mb-2 transition-colors duration-500 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {tier.name}
                      </h3>
                      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`}>
                        {tier.tagline}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-5 mb-12 flex-1 relative z-10">
                      {tier.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-4 group/item">
                          <div className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                            isSelected ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110' : 'bg-slate-900 border-slate-800'
                          }`}>
                            {isSelected ? (
                              <Check className="w-4 h-4 text-white" strokeWidth={4} />
                            ) : (
                              <Activity className="w-3 h-3 text-slate-700" />
                            )}
                          </div>
                          <span className={`text-[13px] font-bold transition-all duration-500 ${
                            isSelected ? 'text-slate-200' : 'text-slate-600 group-hover:text-slate-400'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button Segment */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          onComplete(tier.id);
                        } else {
                          setSelectedTier(tier.id);
                        }
                      }}
                      className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 relative z-10 active:scale-[0.98] ${
                      isSelected 
                        ? `bg-gradient-to-r ${tier.color} text-white shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:brightness-110` 
                        : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                    }`}>
                      {isSelected ? <Zap className="w-4 h-4 fill-current animate-pulse" /> : null}
                      {isSelected ? 'Activate Now' : 'Select Plan'}
                    </button>
                  </GlassCard>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Activation Section */}
        <div className="flex flex-col items-center gap-8 w-full max-w-md animate-slide-up relative z-10">
          <button 
            disabled={!selectedTier}
            onClick={handleActivate}
            className={`group w-full py-6 rounded-3xl font-black text-lg uppercase tracking-[0.25em] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4 transition-all duration-500 active:scale-[0.98] ${
              selectedTier 
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white hover:shadow-indigo-500/20 hover:brightness-110' 
                : 'bg-slate-900/50 text-slate-700 cursor-not-allowed border border-white/5 opacity-40'
            }`}
          >
            <span>Activate Plan</span>
            <ArrowRight className={`w-6 h-6 transition-transform duration-500 ${selectedTier ? 'group-hover:translate-x-2' : ''}`} />
          </button>
          
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Cancel anytime • No commitments</p>
        </div>

        {/* Tactical Security Branding */}
        <div className="mt-20 flex items-center gap-12 transition-opacity duration-1000">
          <div className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-green-500/40 transition-colors">
              <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-green-500" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300">Secure Payment</span>
          </div>
          <div className="flex items-center gap-3 group">
             <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-cyan-500/40 transition-colors">
              <Lock className="w-5 h-5 text-slate-500 group-hover:text-cyan-500" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300">Encrypted</span>
          </div>
          <div className="flex items-center gap-3 group">
             <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-purple-500/40 transition-colors">
              <Radio className="w-5 h-5 text-slate-500 group-hover:text-purple-500" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300">Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionOnboarding;
