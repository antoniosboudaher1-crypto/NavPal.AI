
import React, { useState, useRef } from 'react';
import { Search, Loader2, User as UserIcon, Mic, X, Navigation } from 'lucide-react';
import GlassCard from '../UI/GlassCard';
import VoiceWave from '../UI/VoiceWave';

interface OmniBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onMicClick: () => void;
  onProfileClick?: () => void;
  onDriveClick?: () => void;
  userAvatar?: string;
  aiState?: 'idle' | 'listening' | 'thinking' | 'speaking';
}

const OmniBar: React.FC<OmniBarProps> = ({ 
  onSearch, 
  isLoading, 
  isListening, 
  onMicClick,
  onProfileClick,
  onDriveClick,
  userAvatar,
  aiState = 'idle',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
      inputRef.current?.blur();
      setQuery('');
    }
  };

  const clearInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  let placeholderText = "Where would you like to go?";
  if (aiState === 'listening') placeholderText = "Listening...";
  else if (aiState === 'thinking') placeholderText = "Finding answers...";
  else if (aiState === 'speaking') placeholderText = "NavPal is speaking...";

  return (
    <div className="w-full max-w-2xl px-4 pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      
      {/* Dynamic Progress Indicator */}
      {(isLoading || isListening || aiState !== 'idle') && (
        <div className="w-full h-[2px] mb-4 bg-white/5 rounded-full overflow-hidden pointer-events-none animate-fade-in">
           <div className={`h-full transition-all duration-1000 ${
             aiState === 'listening' ? 'bg-cyan-400 w-1/2 animate-[pulse_1s_infinite]' : 
             aiState === 'thinking' ? 'bg-purple-500 w-full animate-pulse' : 
             'bg-white/40 w-1/4'
           }`} />
        </div>
      )}

      <div className={`w-full transition-all duration-700 ${isFocused ? 'scale-[1.01]' : 'scale-100'}`}>
        <GlassCard className={`relative flex items-center p-2 transition-all duration-500 ${isFocused ? 'bg-[#050508]/98 border-purple-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)]' : 'bg-[#0a0a0f]/90 border-white/10 shadow-2xl'} rounded-[2rem] overflow-visible`}>
          
          <button 
            type="button"
            onClick={onProfileClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 active:scale-90 group overflow-hidden relative shadow-inner ${isFocused ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-slate-900 border border-white/5'}`}
          >
             {userAvatar ? (
               <img src={userAvatar} alt="Profile" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
             ) : (
               <UserIcon className={`w-5 h-5 transition-colors ${isFocused ? 'text-purple-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
             )}
          </button>
          
          <form onSubmit={handleSubmit} className="flex-1 flex items-center mx-4 relative h-12">
            <div className={`absolute left-0 transition-all duration-500 ${isFocused || query ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
               <Search className="w-4 h-4 text-slate-600" />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? "" : placeholderText}
              className={`w-full h-full bg-transparent border-none outline-none text-lg font-bold transition-all duration-500 ${isFocused || query ? 'pl-0 text-white' : 'pl-8 text-slate-300 placeholder-slate-700'}`}
            />

            {query && !isLoading && (
              <button 
                type="button" 
                onClick={clearInput}
                className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button 
            type="button" 
            onClick={onMicClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500 active:scale-90 group ${
              isListening 
                ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]' 
                : 'bg-slate-900 border-white/5 hover:bg-slate-800'
            }`}
          >
             {isLoading ? (
               <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
             ) : isListening ? (
               <VoiceWave isActive={true} barColor="bg-white" />
             ) : (
               <Mic className={`w-6 h-6 transition-colors ${isListening ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'}`} />
             )}
          </button>

        </GlassCard>
      </div>

      {onDriveClick && !isFocused && !query && (
        <div className="mt-6 flex justify-center animate-slide-up">
            <button
                onClick={onDriveClick}
                className="flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-700 border border-white/20 shadow-2xl active:scale-95 transition-all hover:brightness-110 group"
            >
                <Navigation className="w-5 h-5 text-white fill-white/10 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Start Driving</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default OmniBar;
