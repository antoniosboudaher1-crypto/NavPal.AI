
import React, { useState, useEffect } from 'react';
import { CommuteDestination, Coordinates, Place } from '../../types';
import GlassCard from '../UI/GlassCard';
import { X, Briefcase, Plus, MapPin, Trash2, Navigation, Loader2, CarFront, Footprints, Bike } from 'lucide-react';
import { getDirections, geocodeAddress } from '../../services/mapbox';

interface CommutesModalProps {
  userLocation: Coordinates;
  onClose: () => void;
  onNavigate: (destination: Place) => void;
}

const STORAGE_KEY = 'navpal_commutes';

const CommutesModal: React.FC<CommutesModalProps> = ({ userLocation, onClose, onNavigate }) => {
  const [commutes, setCommutes] = useState<CommuteDestination[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMode, setNewMode] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [addError, setAddError] = useState('');

  // Load commutes on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCommutes(parsed);
        refreshETAs(parsed);
      } catch (e) {
        console.warn("Failed to parse stored commutes");
      }
    }
  }, []);

  const refreshETAs = async (list: CommuteDestination[]) => {
    const updatedList = await Promise.all(list.map(async (item) => {
      try {
        const route = await getDirections(userLocation, item.coordinates);
        if (route) {
          return { ...item, latestDuration: route.duration, latestDistance: route.distance };
        }
        return item;
      } catch (e) {
        return item;
      }
    }));
    setCommutes(updatedList);
  };

  const handleAddCommute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAddError('');

    // 1. Geocode Address
    const coords = await geocodeAddress(newAddress, userLocation);
    
    if (!coords) {
      setAddError('Could not find address. Please try a different search.');
      setIsLoading(false);
      return;
    }

    // 2. Create New Commute
    const newItem: CommuteDestination = {
      id: Date.now().toString(),
      name: newName,
      address: newAddress,
      coordinates: coords,
      travelMode: newMode
    };

    // 3. Fetch Initial ETA
    try {
      const route = await getDirections(userLocation, coords);
      if (route) {
        newItem.latestDuration = route.duration;
        newItem.latestDistance = route.distance;
      }
    } catch (e) {
      // ignore
    }

    // 4. Save
    const newList = [...commutes, newItem];
    setCommutes(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    
    // Reset
    setIsAdding(false);
    setNewName('');
    setNewAddress('');
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    const newList = commutes.filter(c => c.id !== id);
    setCommutes(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const handleCommuteClick = (item: CommuteDestination) => {
    const place: Place = {
      id: item.id,
      name: item.name,
      address: item.address,
      coordinates: item.coordinates
    };
    onNavigate(place);
    onClose();
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--';
    const min = Math.ceil(seconds / 60);
    if (min >= 60) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${h}h ${m}m`;
    }
    return `${min} min`;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-4">
      <GlassCard className="w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden bg-slate-900 border-blue-500/20 animate-zoom-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Commutes</h2>
              <p className="text-sm text-slate-400">Saved destinations & travel times</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          
          {/* Add New Form */}
          {isAdding ? (
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 animate-slide-down">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Plus className="w-4 h-4 text-blue-400" /> Add New Destination
               </h3>
               <form onSubmit={handleAddCommute} className="space-y-3">
                 <input
                   type="text"
                   placeholder="Name (e.g. Work, Gym)"
                   value={newName}
                   onChange={e => setNewName(e.target.value)}
                   className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                   required
                 />
                 <input
                   type="text"
                   placeholder="Address"
                   value={newAddress}
                   onChange={e => setNewAddress(e.target.value)}
                   className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                   required
                 />
                 
                 <div className="flex gap-2">
                   {(['driving', 'walking', 'cycling'] as const).map(mode => (
                     <button
                       key={mode}
                       type="button"
                       onClick={() => setNewMode(mode)}
                       className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-colors ${newMode === mode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-transparent text-slate-400 hover:text-white'}`}
                     >
                       {mode === 'driving' && <CarFront className="w-4 h-4" />}
                       {mode === 'walking' && <Footprints className="w-4 h-4" />}
                       {mode === 'cycling' && <Bike className="w-4 h-4" />}
                       <span className="capitalize text-xs font-bold">{mode}</span>
                     </button>
                   ))}
                 </div>

                 {addError && (
                    <p className="text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-900/50">{addError}</p>
                 )}

                 <div className="flex gap-3 mt-4">
                   <button
                     type="button"
                     onClick={() => setIsAdding(false)}
                     className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={isLoading}
                     className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center gap-2"
                   >
                     {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Destination'}
                   </button>
                 </div>
               </form>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 mb-4 group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Add Destination</span>
            </button>
          )}

          {/* Commutes List */}
          <div className="space-y-3">
            {commutes.map((item) => (
              <div key={item.id} className="group relative flex items-center bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-2xl p-4 transition-all shadow-lg">
                {/* Icon */}
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center border border-white/10 shrink-0 group-hover:border-blue-500/50 transition-colors">
                   {item.travelMode === 'driving' && <CarFront className="w-6 h-6 text-blue-400" />}
                   {item.travelMode === 'walking' && <Footprints className="w-6 h-6 text-green-400" />}
                   {item.travelMode === 'cycling' && <Bike className="w-6 h-6 text-orange-400" />}
                </div>
                
                {/* Info */}
                <div className="flex-1 px-4 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-white font-bold truncate">{item.name}</h3>
                    <span className={`text-sm font-bold ${item.latestDuration && item.latestDuration < 600 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {formatDuration(item.latestDuration)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs truncate">{item.address}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-2">
                  <button 
                    onClick={() => handleCommuteClick(item)}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/20 transition-transform active:scale-90"
                    title="Navigate"
                  >
                    <Navigation className="w-5 h-5 fill-current" />
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full hover:bg-red-500/20 text-slate-600 hover:text-red-400 flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {commutes.length === 0 && !isAdding && (
              <div className="text-center py-10 opacity-50">
                 <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                 <p className="text-slate-400">No saved commutes yet.</p>
              </div>
            )}
          </div>

        </div>
      </GlassCard>
    </div>
  );
};

export default CommutesModal;
