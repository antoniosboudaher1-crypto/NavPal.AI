
import React, { useState } from 'react';
import { Place, Theme } from '../../types';
import { 
  Navigation, Star, MapPin, Share2, Clock, 
  CheckCircle2, Phone, Globe, Bookmark, 
  ChevronRight, Info, MessageSquare, Image as ImageIcon,
  Heart, ExternalLink, Calendar, X, Sparkles
} from 'lucide-react';
import GlassCard from '../UI/GlassCard';

interface LocationCardProps {
  place: Place;
  onClose: () => void;
  onNavigate?: () => void;
  onVisualise?: () => void;
  theme?: Theme;
}

const LocationCard: React.FC<LocationCardProps> = ({ place, onClose, onNavigate, onVisualise, theme = 'dark' as Theme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'reviews'>('overview');
  const isDark = theme === 'dark';
  
  const rating = place.rating || 4.8;
  const reviewsCount = place.userRatingsTotal || 154;
  const priceLevel = place.priceLevel || 2;

  const mockReviews = [
    { author: 'Leo M.', rating: 5, text: 'Absolutely fantastic location. The atmosphere is top-notch and the service was beyond helpful.', time: '2 days ago' },
    { author: 'Sarah K.', rating: 4, text: 'Great spot for a quick stop. Parking can be a bit tight during peak hours though.', time: '1 week ago' },
  ];

  const handleCall = () => {
    if (place.phone) window.open(`tel:${place.phone}`);
    else alert("Contact protocol unavailable for this sector.");
  };

  const handleWebsite = () => {
    if (place.website) window.open(place.website, '_blank');
    else if (place.sourceUrl) window.open(place.sourceUrl, '_blank');
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[90] flex justify-center animate-slide-up pointer-events-none px-4 pb-4">
      <div className="w-full max-w-2xl pointer-events-auto">
        <GlassCard theme={theme} className={`overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] flex flex-col max-h-[85vh] ${isDark ? 'bg-[#0a0a0f]/95 border-white/10' : 'bg-white/95 border-slate-200'}`}>
          
          {/* Hero Media Section */}
          <div className="relative h-48 md:h-64 shrink-0 group">
            <img 
              src={place.photoUrl || `https://source.unsplash.com/random/800x600/?${place.category || 'architecture'},city&sig=${place.id}`}
              alt={place.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Header Overlays */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
               <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${place.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{place.isOpen ? 'Active Now' : 'Closed'}</span>
               </div>
               <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90">
                    <X className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Title Block on Image */}
            <div className="absolute bottom-6 left-8 right-8">
               <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight drop-shadow-lg">{place.name}</h2>
               <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                     <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                     <span className="text-sm font-black text-white">{rating}</span>
                     <span className="text-xs font-bold text-white/60">({reviewsCount} reviews)</span>
                  </div>
                  <div className="w-px h-3 bg-white/20" />
                  <span className="text-xs font-black text-white/80 uppercase tracking-widest">{place.category || 'Location'}</span>
                  <div className="w-px h-3 bg-white/20" />
                  <span className="text-sm font-black text-white/80">{"$".repeat(priceLevel)}</span>
               </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="px-4 py-6 border-b border-white/5 flex items-center justify-around bg-slate-900/40">
             <ActionButton icon={<Navigation className="w-5 h-5" />} label="Route" active onClick={onNavigate} color="bg-cyan-500" />
             <ActionButton icon={<Sparkles className="w-5 h-5" />} label="Visualise" onClick={onVisualise} color="bg-indigo-600" />
             <ActionButton icon={<Phone className="w-5 h-5" />} label="Call" onClick={handleCall} theme={theme} />
             <ActionButton icon={<Globe className="w-5 h-5" />} label="Site" onClick={handleWebsite} theme={theme} />
             <ActionButton icon={<Share2 className="w-5 h-5" />} label="Share" theme={theme} />
          </div>

          {/* Tabs */}
          <div className="px-8 flex border-b border-white/5 bg-slate-950/20 shrink-0">
             <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Info className="w-3.5 h-3.5" />} theme={theme} />
             <TabButton label="Photos" active={activeTab === 'photos'} onClick={() => setActiveTab('photos')} icon={<ImageIcon className="w-3.5 h-3.5" />} theme={theme} />
             <TabButton label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare className="w-3.5 h-3.5" />} theme={theme} />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-slate-950/10">
             {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                   <div className="space-y-3">
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mission Description</h4>
                      <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {place.description || "A highly rated destination within the active sector. Grid data suggests stable conditions and high popularity among local pilots."}
                      </p>
                   </div>

                   <div className="space-y-6">
                      <InfoItem icon={<MapPin className="w-4 h-4 text-purple-400" />} label="Vector" value={place.address} theme={theme} />
                      <InfoItem icon={<Clock className="w-4 h-4 text-cyan-400" />} label="Operating Cycle" value="Open • Closes at 10:00 PM" theme={theme} />
                      <InfoItem icon={<Calendar className="w-4 h-4 text-emerald-400" />} label="Availability" value="No reservations needed" theme={theme} />
                      <InfoItem icon={<CheckCircle2 className="w-4 h-4 text-blue-400" />} label="Verification" value="Sector Grid Verified" theme={theme} />
                   </div>
                </div>
             )}

             {activeTab === 'photos' && (
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 animate-fade-in snap-x">
                   {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex-shrink-0 w-72 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 snap-center shadow-lg">
                         <img 
                            src={`https://source.unsplash.com/random/600x400/?building,architecture&sig=${place.id}-${i}`}
                            className="w-full h-full object-cover"
                            alt="Gallery"
                         />
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'reviews' && (
                <div className="space-y-4 animate-fade-in">
                   {mockReviews.map((review, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                         <div className="flex justify-between items-center mb-2">
                            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.author}</span>
                            <div className="flex items-center gap-1">
                               <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                               <span className="text-xs font-bold text-slate-500">{review.rating}</span>
                            </div>
                         </div>
                         <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{review.text}</p>
                         <span className="text-[10px] text-slate-500 mt-2 block uppercase tracking-widest">{review.time}</span>
                      </div>
                   ))}
                </div>
             )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, active, onClick, color, theme }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, color?: string, theme?: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group transition-all">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-all active:scale-90 ${active ? (color || 'bg-cyan-500 border-cyan-400') : (isDark ? 'bg-slate-900 border-white/10 text-slate-500 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900')}`}>
          {icon}
       </div>
       <span className={`text-[10px] font-black uppercase tracking-widest ${active ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>{label}</span>
    </button>
  );
};

const TabButton = ({ label, active, onClick, icon, theme }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode, theme?: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-4 flex items-center justify-center gap-2 border-b-2 transition-all ${active ? 'border-purple-500 text-purple-400 bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
};

const InfoItem = ({ icon, label, value, theme }: { icon: React.ReactNode, label: string, value: string, theme?: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-slate-900 border border-white/5' : 'bg-slate-100 border border-slate-200'}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</span>
        <span className={`text-sm font-bold truncate max-w-[280px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
      </div>
    </div>
  );
};

export default LocationCard;
