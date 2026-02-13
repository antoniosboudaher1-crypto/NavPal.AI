
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Place, CommuteDestination, Coordinates, NavPalAd, Theme } from '../../types';
import { Home, Briefcase, Plus, Search, MapPin, X, Trash2, Loader2, Navigation, Map as MapIcon, ArrowLeft, ArrowRight, Check, Crosshair, MapPinHouse, Sparkles, MapPinned, History, Compass, Map } from 'lucide-react';
import { searchPlaces, reverseGeocode } from '../../services/mapbox';
import GlassCard from '../UI/GlassCard';
import { MAPBOX_ACCESS_TOKEN } from '../../constants';
import { AddressAutofill, useConfirmAddress } from '@mapbox/search-js-react';

interface GoToMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  onNavigate: (place: Place) => void;
  userLocation: Coordinates;
  currentPlaces?: Place[];
  sponsoredAd?: NavPalAd;
  onAdAction?: (ad: NavPalAd) => void;
  onAdClose?: () => void;
  theme?: Theme;
}

const STORAGE_KEY = 'navpal_commutes';

const GoToMenu: React.FC<GoToMenuProps> = ({ 
  isOpen, 
  onClose, 
  onSearch, 
  onNavigate, 
  userLocation,
  theme = 'dark' as Theme
}) => {
  const [savedPlaces, setSavedPlaces] = useState<CommuteDestination[]>([]);
  const [configuringNode, setConfiguringNode] = useState<string | null>(null);
  const isDark = theme === 'dark';
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<any>(null);

  const [nodeQuery, setNodeQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const { formRef, showConfirm } = useConfirmAddress({
    footer: 'Confirm Address',
    accessToken: MAPBOX_ACCESS_TOKEN
  });

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setSavedPlaces(JSON.parse(stored));
        } catch (e) { console.warn("Error parsing saved places"); }
      }
    } else {
        resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setQuery('');
    setSuggestions([]);
    setNodeQuery('');
    setConfiguringNode(null);
    setIsLocating(false);
    setSelectedFeature(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);

      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      if (val.trim().length > 2) {
          setIsSearching(true);
          searchTimeout.current = setTimeout(async () => {
              const results = await searchPlaces(val, userLocation);
              setSuggestions(results);
              setIsSearching(false);
          }, 300);
      } else {
          setSuggestions([]);
          setIsSearching(false);
      }
  };

  const saveNode = (name: string, address: string, coordinates: Coordinates) => {
    const newPlace: CommuteDestination = {
      id: `node_${name.toLowerCase()}`,
      name: name,
      address: address,
      coordinates: coordinates,
      travelMode: 'driving'
    };
    
    const filtered = savedPlaces.filter(p => p.name.toLowerCase() !== name.toLowerCase());
    const updated = [...filtered, newPlace];
    
    setSavedPlaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    resetState();
  };

  const handleAutofillRetrieve = useCallback((res: any) => {
    if (res.features && res.features.length > 0) {
      setSelectedFeature(res.features[0]);
    }
  }, []);

  const handleConfirmAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringNode) return;

    const result = await showConfirm();

    if (result.type === 'nochange' || result.type === 'change') {
      const feature = result.type === 'change' ? result.feature : selectedFeature;
      if (feature) {
        saveNode(
          configuringNode,
          feature.properties.full_address || feature.properties.name,
          { lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1] }
        );
      } else if (nodeQuery) {
        const manualCoords = await searchPlaces(nodeQuery, userLocation);
        if (manualCoords.length > 0) {
          saveNode(configuringNode, manualCoords[0].address, manualCoords[0].coordinates);
        }
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!configuringNode) return;
    setIsLocating(true);
    try {
        const address = await reverseGeocode(userLocation);
        saveNode(configuringNode, address || 'My Location', userLocation);
    } finally {
        setIsLocating(false);
    }
  };

  const handleDeletePlace = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedPlaces.filter(p => p.id !== id);
    setSavedPlaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleNodeReset = (e: React.MouseEvent, label: string) => {
    e.stopPropagation();
    const updated = savedPlaces.filter(p => p.name.toLowerCase() !== label.toLowerCase());
    setSavedPlaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const categories = [
    { label: 'Gas', icon: '⛽', query: 'Gas stations', color: 'from-amber-400 to-orange-600', glow: 'rgba(245,158,11,0.3)' },
    { label: 'Food', icon: '🍔', query: 'Restaurants', color: 'from-rose-400 to-pink-600', glow: 'rgba(244,63,94,0.3)' },
    { label: 'Coffee', icon: '☕', query: 'Coffee shops', color: 'from-emerald-400 to-teal-600', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Parking', icon: '🅿️', query: 'Parking', color: 'from-blue-400 to-indigo-600', glow: 'rgba(59,130,246,0.3)' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-950/40 backdrop-blur-xl animate-fade-in transition-all">
      <div className="absolute inset-0" onClick={onClose} />
      
      <GlassCard theme={theme} className={`w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-t-[3.5rem] md:rounded-[4rem] transition-all border-t-2 ${isDark ? 'bg-[#050508]/95 border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.9)]' : 'bg-white/98 border-slate-200 shadow-[0_40px_100px_rgba(0,0,0,0.1)]'}`}>
        
        <div className="w-full flex justify-center pt-5 pb-1 shrink-0 cursor-grab active:cursor-grabbing" onClick={onClose}>
          <div className={`w-16 h-1.5 rounded-full transition-colors ${isDark ? 'bg-white/10 group-hover:bg-white/20' : 'bg-slate-200'}`} />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10 space-y-10">
            
            {configuringNode ? (
              <div className="animate-slide-up py-4 space-y-10">
                  <div className="flex items-center gap-5">
                     <button onClick={() => setConfiguringNode(null)} className={`p-4 rounded-2xl transition-all active:scale-90 ${isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        <ArrowLeft className="w-6 h-6" />
                     </button>
                     <div>
                        <h2 className={`text-3xl font-black tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Set {configuringNode}</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Choose a location</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                      <button 
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className={`w-full h-20 flex items-center justify-center gap-4 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] border-2 transition-all active:scale-95 group overflow-hidden ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'}`}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                         {isLocating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Crosshair className="w-6 h-6 group-hover:rotate-90 transition-transform" />}
                         Use Current Location
                      </button>

                      <form ref={formRef} onSubmit={handleConfirmAndSave} className="space-y-8">
                         <div className="relative">
                            <AddressAutofill 
                                accessToken={MAPBOX_ACCESS_TOKEN}
                                onRetrieve={handleAutofillRetrieve}
                              >
                                <div className={`flex items-center rounded-[2.5rem] h-20 px-8 border-2 transition-all shadow-inner ${isDark ? 'bg-slate-950 border-white/5 focus-within:border-cyan-500/50' : 'bg-slate-50 border-slate-100 focus-within:border-indigo-400/40'}`}>
                                    <MapPinned className="w-7 h-7 mr-5 text-slate-600" />
                                    <input 
                                        name="address"
                                        autoComplete="address-line1"
                                        autoFocus
                                        type="text" 
                                        placeholder={`Search for ${configuringNode.toLowerCase()}...`}
                                        value={nodeQuery}
                                        onChange={(e) => setNodeQuery(e.target.value)}
                                        className={`flex-1 bg-transparent border-none outline-none text-xl font-bold ${isDark ? 'text-white placeholder-slate-800' : 'text-slate-900 placeholder-slate-400'}`}
                                    />
                                </div>
                                <input className="hidden" name="city" autoComplete="address-level2" />
                                <input className="hidden" name="state" autoComplete="address-level1" />
                                <input className="hidden" name="zip" autoComplete="postal-code" />
                             </AddressAutofill>
                         </div>

                         <button 
                           type="submit"
                           disabled={!nodeQuery}
                           className={`w-full h-20 flex items-center justify-center gap-4 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-95 ${isDark ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)]' : 'bg-slate-900 text-white disabled:bg-slate-100 disabled:text-slate-400 shadow-xl shadow-indigo-900/10'}`}
                         >
                            Save this location
                            <ArrowRight className="w-5 h-5" />
                         </button>
                      </form>
                  </div>
              </div>
            ) : (
              <>
                <div className="pt-4 flex items-center justify-between">
                   <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Search</span>
                      </div>
                      <h2 className={`text-4xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Where to?</h2>
                   </div>
                   <button onClick={onClose} className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                     <X className="w-7 h-7" strokeWidth={3} />
                   </button>
                </div>

                <div className="relative group">
                    <div className={`relative flex items-center rounded-[3rem] h-20 px-8 border-2 transition-all shadow-2xl ${isDark ? 'bg-slate-950/80 border-white/5 focus-within:border-cyan-500/50' : 'bg-white border-slate-100 focus-within:border-indigo-400/40 shadow-slate-200'}`}>
                        <Search className={`w-7 h-7 mr-5 transition-colors ${isSearching ? 'text-cyan-400' : (isDark ? 'text-slate-700' : 'text-slate-400')}`} />
                        <input 
                            type="text" 
                            placeholder="Find a place or address..."
                            value={query}
                            onChange={handleSearchChange}
                            className={`flex-1 bg-transparent border-none outline-none text-xl font-bold ${isDark ? 'text-white placeholder-slate-800' : 'text-slate-900 placeholder-slate-400'}`}
                        />
                        {isSearching && <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />}
                    </div>

                    {suggestions.length > 0 && (
                        <div className={`absolute top-24 left-0 right-0 border rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] p-3 z-[70] animate-zoom-in max-h-[420px] overflow-y-auto no-scrollbar ${isDark ? 'bg-[#0a0a0f] border-white/10 backdrop-blur-3xl' : 'bg-white border-slate-200'}`}>
                            {suggestions.map((place, idx) => (
                                <button 
                                  key={place.id} 
                                  onClick={() => { onNavigate(place); onClose(); }} 
                                  className={`w-full text-left p-5 rounded-[2.5rem] flex items-center gap-5 transition-all group active:scale-[0.98] ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                                >
                                    <div className={`w-14 h-14 rounded-[1.75rem] flex items-center justify-center border-2 shadow-lg transition-all ${isDark ? 'bg-slate-950 border-white/5 text-slate-700 group-hover:text-cyan-400 group-hover:border-cyan-500/30' : 'bg-white border-slate-100 text-slate-400 group-hover:text-indigo-600'}`}>
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`block font-black text-base truncate uppercase tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{place.name}</span>
                                        <span className={`block text-[10px] font-bold truncate opacity-40 mt-1 uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{place.address}</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                   {['Home', 'Work'].map(label => {
                       const node = savedPlaces.find(p => p.name.toLowerCase() === label.toLowerCase());
                       const colorClass = label === 'Home' ? 'from-cyan-400 to-blue-600' : 'from-indigo-400 to-purple-600';
                       const glowColor = label === 'Home' ? 'rgba(34,211,238,0.2)' : 'rgba(168,85,247,0.2)';
                       
                       return (
                        <div key={label} className="relative group/node">
                            <button 
                                onClick={() => {
                                    if (node) { onNavigate({ id: node.id, name: node.name, address: node.address, coordinates: node.coordinates }); onClose(); }
                                    else { setConfiguringNode(label); }
                                }} 
                                className={`w-full flex flex-col items-center justify-center p-8 rounded-[3.5rem] border-2 transition-all duration-500 active:scale-[0.94] relative overflow-hidden ${node ? (isDark ? 'bg-[#0a0a0f] border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50') : (isDark ? 'bg-slate-950 border-dashed border-white/5 text-slate-800' : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 hover:bg-slate-100')}`}
                                style={{ boxShadow: node ? `0 20px 40px ${glowColor}` : 'none' }}
                            >
                                <div className={`relative w-20 h-20 rounded-[2rem] bg-gradient-to-br ${node ? colorClass : 'from-slate-800 to-slate-900 opacity-10'} flex items-center justify-center text-white mb-5 shadow-2xl transition-transform duration-700 group-hover/node:scale-110 group-hover/node:rotate-3`}>
                                    <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur-md opacity-0 group-hover/node:opacity-100 transition-opacity" />
                                    {label === 'Home' ? <Home className="w-10 h-10 relative z-10" /> : <Briefcase className="w-10 h-10 relative z-10" />}
                                </div>
                                <span className={`block font-black text-sm tracking-[0.2em] uppercase transition-colors ${node ? (isDark ? 'text-white' : 'text-slate-950') : 'text-slate-600'}`}>{label}</span>
                                <div className={`mt-2 flex items-center gap-1.5 transition-opacity ${node ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${node ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${node ? 'text-emerald-500' : 'text-slate-700'}`}>
                                        {node ? 'Saved' : 'Not set'}
                                    </span>
                                </div>
                            </button>
                            {node && (
                                <button 
                                    onClick={(e) => handleNodeReset(e, label)}
                                    className={`absolute -top-1 -right-1 p-2.5 rounded-full border shadow-xl transition-all opacity-0 group-hover/node:opacity-100 scale-75 group-hover/node:scale-100 ${isDark ? 'bg-slate-950 border-white/10 text-slate-600 hover:text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-600'}`}
                                    title="Reset location"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                       );
                   })}
                </div>

                <div className="space-y-5 pt-2">
                    <div className="flex items-center gap-2 px-1">
                      <Compass className="w-3.5 h-3.5 text-slate-600" />
                      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Quick Search</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <button 
                              key={cat.label} 
                              onClick={() => { onSearch(cat.query); onClose(); }} 
                              className="flex flex-col items-center gap-3 group transition-transform active:scale-90"
                            >
                                <div 
                                  className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center text-3xl shadow-2xl transition-all duration-500 bg-gradient-to-br ${cat.color} border-[5px] group-hover:scale-110 group-hover:-rotate-6 ${isDark ? 'border-[#0a0a0f]' : 'border-white'}`}
                                  style={{ boxShadow: `0 15px 30px ${cat.glow}` }}
                                >
                                    <div className="absolute inset-0 rounded-[1.25rem] bg-white/10 opacity-40 blur-sm pointer-events-none" />
                                    <span className="relative z-10 drop-shadow-md">{cat.icon}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-800'}`}>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {savedPlaces.filter(p => !['home', 'work'].includes(p.name.toLowerCase())).length > 0 && (
                   <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <History className="w-3.5 h-3.5 text-slate-600" />
                          <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Recents</h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                         {savedPlaces.filter(p => !['home', 'work'].includes(p.name.toLowerCase())).map(place => (
                            <div key={place.id} className="group relative">
                                <button 
                                    onClick={() => { onNavigate({ id: place.id, name: place.name, address: place.address, coordinates: place.coordinates }); onClose(); }} 
                                    className={`w-full flex items-center gap-5 p-5 rounded-[2.5rem] border transition-all active:scale-[0.98] ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10' : 'bg-slate-50 border-transparent hover:bg-slate-100 shadow-sm'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isDark ? 'bg-slate-950 border border-white/5 text-slate-700 group-hover:text-cyan-400 group-hover:border-cyan-500/30' : 'bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-600'}`}>
                                        <MapIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <span className={`block font-black text-sm tracking-tight uppercase ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>{place.name}</span>
                                        <span className="block text-[10px] font-bold truncate mt-1 text-slate-600 uppercase tracking-widest">{place.address}</span>
                                    </div>
                                    <div 
                                      onClick={(e) => handleDeletePlace(e, place.id)} 
                                      className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </div>
                                </button>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
              </>
            )}
        </div>
        
        <div className="shrink-0 flex flex-col pointer-events-none">
          <div className="h-[3px] w-full bg-indigo-500/10 overflow-hidden">
             <div className="h-full bg-indigo-500 animate-[slideInRight_5s_linear_infinite] w-1/3 shadow-[0_0_15px_rgba(99,102,241,1)]" />
          </div>
          <div className="px-10 py-5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">Ready to go</span>
             </div>
             <div className="flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-slate-800" />
                <span className="text-[8px] font-black text-slate-800 uppercase tracking-[0.2em]">NavPal App v3.5</span>
             </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default GoToMenu;
