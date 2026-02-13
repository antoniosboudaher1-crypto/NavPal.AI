
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  X, 
  Music as MusicIcon,
  Search
} from 'lucide-react';

interface MusicWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  externalState?: {
    isPlaying: boolean;
    volume: number;
    track: string;
    artist?: string;
    artwork?: string;
  };
  onControl?: (cmd: { type: string, value?: any }) => void;
}

const MusicWidget: React.FC<MusicWidgetProps> = ({ isOpen, onClose, externalState, onControl }) => {
  const isPlaying = externalState?.isPlaying ?? false;
  const currentTrack = externalState?.track ?? 'Night Drive Mix';
  const currentArtist = externalState?.artist ?? 'NavPal AI Radio';
  const currentVolume = externalState?.volume ?? 75;

  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-in-right">
      <GlassCard className="overflow-hidden bg-[#0a0a0f]/98 border-t-2 border-purple-500/40 shadow-[0_20px_80px_rgba(0,0,0,0.9)] rounded-[2.5rem]">
        
        {/* Simple Top Header */}
        <div className="px-6 pt-6 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <MusicIcon className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Media Player</span>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-8 flex flex-col items-center">
           {/* Artwork / Viz */}
           <div className="relative w-40 h-40 mb-6 group">
              <div className="absolute inset-0 bg-purple-600/20 blur-2xl rounded-full group-hover:bg-purple-600/30 transition-all" />
              <div className="relative w-full h-full rounded-[2.5rem] bg-slate-900 border border-white/5 flex items-center justify-center overflow-hidden">
                 {externalState?.artwork ? (
                   <img src={externalState.artwork} alt="Artwork" className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex gap-1.5 items-end h-12">
                      {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 bg-purple-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-wave' : ''}`}
                          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                   </div>
                 )}
              </div>
           </div>

           {/* Track Info */}
           <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-1">{currentTrack}</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{currentArtist}</p>
           </div>

           {/* Playback Controls */}
           <div className="flex items-center justify-center gap-10 mb-8">
              <button 
                onClick={() => onControl?.({ type: 'PREV' })}
                className="text-slate-500 hover:text-white transition-colors active:scale-90"
              >
                <SkipBack className="w-7 h-7 fill-current" />
              </button>
              
              <button 
                onClick={() => onControl?.({ type: isPlaying ? 'PAUSE' : 'PLAY' })}
                className="w-20 h-20 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>

              <button 
                onClick={() => onControl?.({ type: 'NEXT' })}
                className="text-slate-500 hover:text-white transition-colors active:scale-90"
              >
                <SkipForward className="w-7 h-7 fill-current" />
              </button>
           </div>

           {/* Volume Slider */}
           <div className="w-full flex items-center gap-4 px-2">
              <Volume2 className="w-4 h-4 text-slate-600" />
              <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
                 <div 
                   className="absolute left-0 top-0 bottom-0 bg-purple-500"
                   style={{ width: `${currentVolume}%` }}
                 />
              </div>
              <span className="text-[10px] font-black text-slate-600 w-8">{currentVolume}%</span>
           </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-950/50 border-t border-white/5 flex justify-center">
           <button className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-purple-400 transition-colors">
              <Search className="w-3 h-3" /> Browse Library
           </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default MusicWidget;
