
import React, { useState } from 'react';
import { Place, Driver, User } from '../../types';
import GlassCard from '../UI/GlassCard';
import { Share2, SendHorizontal, X, User as UserIcon, Check, Copy, Loader2, Sparkles, MapPin, Globe } from 'lucide-react';

interface ShareRouteModalProps {
  destination: Place;
  activeDrivers: Driver[];
  currentUser: User | null;
  onClose: () => void;
  onShareWithDriver: (recipientId: string) => Promise<boolean>;
}

const ShareRouteModal: React.FC<ShareRouteModalProps> = ({
  destination,
  activeDrivers,
  onClose,
  onShareWithDriver
}) => {
  const [copied, setCopied] = useState(false);
  const [sharingWithId, setSharingWithId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const generateShareLink = () => {
    const payload = btoa(JSON.stringify({
      n: destination.name,
      a: destination.address,
      lt: destination.coordinates.lat,
      lg: destination.coordinates.lng
    }));
    
    let baseUrl = 'https://navpal.ai'; 
    
    try {
      if (typeof window !== 'undefined') {
        // window.origin is safer for cross-origin frames than window.location.origin
        if (window.origin && window.origin !== 'null') {
          baseUrl = window.origin;
        } else if (window.location) {
          baseUrl = window.location.origin;
        }
      }
    } catch (e) {
      console.warn("Cross-origin location access restricted, using default.");
    }
    
    return `${baseUrl}/?intel=${payload}`;
  };

  const handleCopyLink = () => {
    try {
      const link = generateShareLink();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Clipboard access failed", e);
    }
  };

  const handleShareDirect = async (driverId: string) => {
    setSharingWithId(driverId);
    const success = await onShareWithDriver(driverId);
    setSharingWithId(null);
    if (success) {
      setSuccessId(driverId);
      setTimeout(() => setSuccessId(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-[440px] animate-zoom-in">
        <GlassCard className="relative overflow-hidden bg-[#0a0a0f]/98 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[3rem]">
          
          {/* Symmetrical Header */}
          <div className="p-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                 <Share2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none">Share Intel</h3>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5">Dispatch Vector</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-full bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90 border border-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-8 pb-10 space-y-8">
            
            {/* Target Preview */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
               <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Objective</span>
               </div>
               <h4 className="text-xl font-black text-white tracking-tight mb-1">{destination.name}</h4>
               <p className="text-xs text-slate-400 truncate">{destination.address}</p>
            </div>

            {/* Public Link Generator */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Globe className="w-3 h-3 text-cyan-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Grid Link</span>
               </div>
               <div className="relative group">
                  <input 
                    readOnly
                    type="text" 
                    value={generateShareLink()}
                    className="w-full h-14 bg-slate-950 border border-white/5 rounded-2xl pl-5 pr-16 text-[10px] font-bold text-slate-400 outline-none"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className={`absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'}`}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
               </div>
            </div>

            {/* Direct Sync (Nearby Drivers) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nearby Pilots</span>
                   </div>
                   <span className="text-[9px] font-black text-slate-700 uppercase">{activeDrivers.length} Active</span>
                </div>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
                    {activeDrivers.length > 0 ? activeDrivers.map((driver) => {
                       const isSharing = sharingWithId === driver.id;
                       const isSuccess = successId === driver.id;
                       
                       return (
                        <div key={driver.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10">
                                 <UserIcon className="w-5 h-5 text-slate-500" />
                              </div>
                              <span className="text-xs font-bold text-slate-200">{driver.name || 'Anonymous Pilot'}</span>
                           </div>
                           <button 
                             onClick={() => handleShareDirect(driver.id)}
                             disabled={isSharing || isSuccess}
                             className={`p-2.5 rounded-xl transition-all active:scale-90 ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                           >
                              {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : isSuccess ? <Check className="w-5 h-5" /> : <SendHorizontal className="w-5 h-5" />}
                           </button>
                        </div>
                       );
                    }) : (
                        <div className="text-center py-6 opacity-30">
                           <p className="text-[10px] font-black uppercase tracking-widest">No local pilots detected</p>
                        </div>
                    )}
                </div>
            </div>

          </div>

          <div className="px-8 py-5 border-t border-white/5 bg-slate-950 flex items-center justify-center">
             <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">NavPal Tactical Dispatch</span>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};

export default ShareRouteModal;
