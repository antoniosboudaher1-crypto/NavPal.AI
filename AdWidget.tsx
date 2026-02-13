
import React from 'react';
import { NavPalAd } from '../../types';
import { ExternalLink, X, Info } from 'lucide-react';

interface AdWidgetProps {
  ad: NavPalAd;
  variant?: 'banner' | 'card';
  onClose?: () => void;
  onAction?: (ad: NavPalAd) => void;
}

/**
 * AdWidget component for displaying sponsored content within the navigation menus.
 */
const AdWidget: React.FC<AdWidgetProps> = ({ ad, variant = 'card', onClose, onAction }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md p-4 group transition-all hover:bg-slate-900/80 ${variant === 'banner' ? 'w-full' : 'w-64'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-white/5">
            <Info className="w-3 h-3 text-slate-500" />
          </div>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sponsored Content</span>
        </div>
        {onClose && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="p-1 rounded-full bg-white/5 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      
      <div className="flex gap-4 items-center">
        {ad.imageUrl && (
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
            <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{ad.title}</h4>
          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{ad.description}</p>
        </div>
      </div>

      <button 
        onClick={() => onAction?.(ad)}
        className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
      >
        {ad.actionLabel || 'Learn More'}
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
};

export default AdWidget;
