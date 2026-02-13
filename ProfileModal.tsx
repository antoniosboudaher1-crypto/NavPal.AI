
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Theme, TempUnit, SpeedUnit } from '../../types';
import { 
  LogOut, User as UserIcon, Volume2, VolumeX, History, Pencil, 
  Car, Truck, Rocket, Sun, Moon, ChevronRight, Zap, X, ShoppingBag, 
  Award, Check, Coins, RefreshCcw, Activity, CloudSun, Trophy, Bike,
  Filter, Grid, LayoutGrid, Settings, Sparkles, Box, Info
} from 'lucide-react';

interface ProfileModalProps {
  user: User;
  theme: Theme;
  onToggleTheme: () => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  speedUnit: SpeedUnit;
  onToggleSpeedUnit: () => void;
  onClose: () => void;
  onLogout: () => void;
  showSpeedometer: boolean;
  onToggleSpeedometer: () => void;
  isVoiceMuted: boolean;
  onToggleVoiceMute: () => void;
  onUpdateUser: (name: string, vehicleType?: User['vehicleType'], avatar?: string, markerColor?: string, markerStyle?: User['markerStyle']) => void;
  onViewHistory: () => void;
  onViewAssets: () => void;
  showSpeedLimit: boolean;
  onToggleSpeedLimit: () => void;
  trafficAlertsEnabled: boolean;
  onToggleTrafficAlerts: () => void;
  speedWarningsEnabled: boolean;
  onToggleSpeedWarnings: () => void;
  aiResponsesEnabled: boolean;
  onToggleAiResponses: () => void;
  showWeatherHUD: boolean;
  onToggleWeatherHUD: () => void;
  showNavPoints?: boolean;
  onToggleNavPoints?: () => void;
  navRuntime?: any;
  onUpdateNavRuntime?: (updates: any) => void;
  initialTab?: 'profile' | 'store';
  onAwardPoints: (amount: number, label: string) => void;
}

const PRESET_AVATARS = [
  { id: 'av1', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', cost: 0 },
  { id: 'av2', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Maverick', cost: 2500 },
  { id: 'av3', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Neon', cost: 5000 },
];

const VEHICLE_MODELS = [
  // --- The Elite Selection (Curated Legends) ---
  { id: 'bmw_m3', label: 'BMW M3 Competition', image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=800&auto=format&fit=crop', cost: 42000, niche: 'German' },
  { id: 'audi_rs5', label: 'Audi RS5 Sportback', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800&auto=format&fit=crop', cost: 40000, niche: 'German' },
  { id: 'porsche_911', label: 'Porsche 911 GT3', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop', cost: 35000, niche: 'German' },
  { id: 'lamborghini_h', label: 'Huracán STO', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop', cost: 85000, niche: 'Exotic' },
  { id: 'cyber_truck', label: 'Tesla Cybertruck', image: 'https://images.unsplash.com/photo-1662583321072-463870370425?q=80&w=800&auto=format&fit=crop', cost: 45000, niche: 'Tech' },
  { id: 'ducati_pani', label: 'Ducati Panigale', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop', cost: 22000, niche: 'Bike' },
  { id: 'honda_civic', label: 'Civic Type R', image: 'https://images.unsplash.com/photo-1605041113540-3947265e3170?q=80&w=800&auto=format&fit=crop', cost: 0, niche: 'Popular' },
];

const MARKER_STYLES = [
  { id: 'pulse', label: 'Standard Pulse', cost: 0 },
  { id: 'glow', label: 'Neural Glow', cost: 4000 },
  { id: 'shield', label: 'Tactical Shield', cost: 6000 },
];

const POINT_PACKS = [
  { id: 'pack1', points: 10000, price: 10, label: 'Starter', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop', icon: <Coins className="w-5 h-5 text-indigo-400" /> },
  { id: 'pack2', points: 50000, price: 40, label: 'Grand Architect', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop', icon: <Trophy className="w-5 h-5 text-amber-400" />, popular: true },
];

const WaveHeader = ({ theme }: { theme: Theme }) => (
  <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden rounded-t-[3rem] pointer-events-none z-0">
    <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'dark' ? 'from-indigo-950/50' : 'from-indigo-100'} to-transparent`} />
    <svg className={`absolute bottom-0 w-[200%] h-16 ${theme === 'light' ? 'text-indigo-600/5' : 'text-indigo-400/10'}`} viewBox="0 0 1000 100" preserveAspectRatio="none">
      <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" fill="currentColor" />
    </svg>
  </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  user, theme, onToggleTheme, tempUnit, onToggleTempUnit, speedUnit, onToggleSpeedUnit, onClose, onLogout, 
  isVoiceMuted, onToggleVoiceMute, onUpdateUser, 
  onViewHistory, showWeatherHUD, onToggleWeatherHUD, initialTab = 'profile', onAwardPoints
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'store'>(initialTab);
  const [storeSubTab, setStoreSubTab] = useState<'points' | 'garage'>('points');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [tempAvatar, setTempAvatar] = useState(user.avatar || PRESET_AVATARS[0].url);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const handleSaveProfile = () => {
    if (editName.trim()) {
      onUpdateUser(editName, user.vehicleType, tempAvatar, user.markerColor, user.markerStyle);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setTempAvatar(user.avatar || PRESET_AVATARS[0].url);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleItemPurchase = (type: 'color' | 'avatar' | 'model' | 'style', itemId: string, cost: number) => {
    if ((user.contributionScore || 0) < cost) {
        alert("Not enough points.");
        return;
    }

    setIsProcessingPurchase(itemId);
    setTimeout(() => {
        setIsProcessingPurchase(null);
        if (cost > 0) onAwardPoints(-cost, "Store Purchase");
        
        const updates = {
            name: user.name,
            model: user.vehicleType,
            avatar: user.avatar,
            color: user.markerColor,
            style: user.markerStyle
        };

        if (type === 'color') updates.color = itemId;
        else if (type === 'avatar') updates.avatar = itemId;
        else if (type === 'model') updates.model = itemId;
        else if (type === 'style') updates.style = itemId as User['markerStyle'];

        onUpdateUser(updates.name, updates.model, updates.avatar, updates.color, updates.style);
    }, 800);
  };

  const displayDistance = speedUnit === 'MPH' 
    ? Math.round((user.milesDriven || 0) * 0.621371) 
    : user.milesDriven || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-md h-[85vh] md:h-[90vh] overflow-hidden shadow-2xl rounded-[3rem] border-t-2 transition-all duration-300 flex flex-col ${isDark ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-100'}`}>
        <WaveHeader theme={theme} />

        <div className="relative z-10 flex flex-col h-full pt-10 pb-4 px-6 overflow-hidden">
          
          <div className="flex justify-between items-center mb-6 shrink-0">
             <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>My Profile</button>
                <button onClick={() => setActiveTab('store')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'store' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>The Shop</button>
             </div>
             <button onClick={onClose} className="p-2.5 rounded-full hover:bg-white/10 text-slate-500"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            {activeTab === 'profile' ? (
                <div className="space-y-8 animate-fade-in min-h-full">
                  <div className="flex flex-col items-center">
                    <div onClick={() => isEditing ? fileInputRef.current?.click() : setIsEditing(true)} className="relative group cursor-pointer active:scale-95 transition-transform">
                      <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl">
                        <div className={`w-full h-full rounded-full border-4 overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-900 border-slate-900' : 'bg-white border-white'}`}>
                          <img src={isEditing ? tempAvatar : (user.avatar || PRESET_AVATARS[0].url)} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      {!isEditing && <div className="absolute -bottom-1 -right-1 p-2.5 rounded-full bg-indigo-600 text-white border-4 border-slate-950"><Pencil className="w-3.5 h-3.5" /></div>}
                    </div>
                    <div className="mt-4 text-center w-full">
                      {isEditing ? (
                        <div className="flex flex-col gap-4">
                          <input autoFocus value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-950 border-2 border-white/10 rounded-2xl px-6 py-4 text-xl font-bold text-center text-white" placeholder="Name..." />
                          <div className="grid grid-cols-2 gap-3 px-4">
                            <button onClick={handleSaveProfile} className="py-3.5 bg-indigo-600 text-white rounded-xl font-bold">Save</button>
                            <button onClick={handleCancelEdit} className="py-3.5 bg-white/5 text-slate-400 rounded-xl font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-3xl font-black tracking-tight text-white">{user.name}</h2>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Active Member</p>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        <StatCard label="Driven" value={`${displayDistance} ${speedUnit === 'MPH' ? 'mi' : 'km'}`} icon={<Activity className="w-3.5 h-3.5" />} color="text-indigo-400" isDark={isDark} />
                        <StatCard label="Points" value={user.contributionScore || 0} icon={<Award className="w-3.5 h-3.5" />} color="text-amber-400" isDark={isDark} />
                      </div>

                      <div className={`rounded-[2.5rem] border overflow-hidden ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="p-5 border-b border-white/5"><SectionHeader text="Preferences" isDark={isDark} /></div>
                        <div className="p-3 space-y-1.5">
                          <PreferenceToggle label="Dark Theme" active={isDark} onToggle={onToggleTheme} icon={isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} isDark={isDark} />
                          <PreferenceToggle label="Weather HUD" active={showWeatherHUD} onToggle={onToggleWeatherHUD} icon={<CloudSun className="w-4 h-4" />} isDark={isDark} />
                          <PreferenceToggle label="Voice Help" active={!isVoiceMuted} onToggle={onToggleVoiceMute} icon={isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />} isDark={isDark} />
                        </div>
                      </div>

                      <button onClick={onLogout} className="w-full py-4.5 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-xs uppercase tracking-widest border border-rose-500/20">Sign Out</button>
                    </div>
                  )}
                </div>
            ) : (
                <div className="animate-slide-up space-y-8 min-h-full">
                  <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-slate-950/90 to-purple-950/80" />
                    <div className="relative z-10 p-8 flex flex-col">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Points</span>
                      <div className="flex items-center gap-4">
                        <Coins className="w-8 h-8 text-amber-400" />
                        <span className="text-5xl font-black text-white tabular-nums tracking-tighter">{user.contributionScore?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5 mx-auto">
                    <button onClick={() => setStoreSubTab('points')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${storeSubTab === 'points' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Points</button>
                    <button onClick={() => setStoreSubTab('garage')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${storeSubTab === 'garage' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Garage</button>
                  </div>

                  {storeSubTab === 'points' ? (
                    <div className="grid grid-cols-1 gap-4">
                        {POINT_PACKS.map(pack => (
                            <button key={pack.id} onClick={() => onAwardPoints(pack.points, "Refill")} className="relative h-24 rounded-3xl border-2 border-white/5 bg-slate-900 overflow-hidden flex items-center justify-between px-8 group active:scale-95 transition-all">
                                <div className="flex items-center gap-4">
                                   {pack.icon}
                                   <div className="text-left">
                                      <span className="block text-xl font-black text-white">{pack.points.toLocaleString()}</span>
                                      <span className="text-[9px] font-black text-indigo-400 uppercase">{pack.label}</span>
                                   </div>
                                </div>
                                <div className="text-white font-black">${pack.price}</div>
                            </button>
                        ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 pb-10">
                        {VEHICLE_MODELS.map(model => (
                            <button 
                                key={model.id} 
                                onClick={() => handleItemPurchase('model', model.id, model.cost)}
                                className={`relative h-24 rounded-3xl border-2 transition-all flex items-center justify-between px-6 overflow-hidden ${user.vehicleType === model.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-slate-900/50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 rounded-xl overflow-hidden border border-white/10">
                                       <img src={model.image} className="w-full h-full object-cover opacity-60" alt={model.label} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-[11px] font-black text-white uppercase tracking-tight">{model.label}</span>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">{model.niche}</span>
                                    </div>
                                </div>
                                {user.vehicleType === model.id ? <Check className="w-5 h-5 text-indigo-400" /> : <div className="text-[10px] font-black text-amber-400">{(model.cost / 1000).toFixed(0)}k PTS</div>}
                            </button>
                        ))}
                    </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ text, isDark }: { text: string, isDark: boolean }) => (
  <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{text}</h3>
);

const StatCard = ({ label, value, icon, color, isDark }: { label: string, value: any, icon: React.ReactNode, color: string, isDark: boolean }) => (
  <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
    <div className="flex items-center gap-2 mb-2 opacity-50">{icon}<span className={`text-[9px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span></div>
    <span className={`text-3xl font-black tracking-tighter tabular-nums ${isDark ? 'text-white' : 'text-slate-900'} ${color}`}>{value}</span>
  </div>
);

const PreferenceToggle = ({ label, active, onToggle, icon, isDark }: { label: string, active: boolean, onToggle: () => void, icon: React.ReactNode, isDark: boolean }) => (
  <button onClick={onToggle} className={`w-full flex items-center justify-between p-4 rounded-2xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{icon}</div>
      <span className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </div>
    <div className={`w-11 h-6 rounded-full p-1 transition-colors ${active ? 'bg-indigo-600' : 'bg-slate-700'}`}><div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} /></div>
  </button>
);

export default ProfileModal;
