import React, { useMemo } from 'react';
import { Mic, Square, Loader2, Sparkles, Radio } from 'lucide-react';
import VoiceWave from '../UI/VoiceWave';

interface OrbitalAssistantProps {
  isActive: boolean;
  isConnecting?: boolean;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  onClick: () => void;
  mini?: boolean;
}

const OrbitalAssistant: React.FC<OrbitalAssistantProps> = ({ 
  isActive, 
  isConnecting, 
  state, 
  onClick,
  mini = false 
}) => {
  
  const config = useMemo(() => {
    // Shared fixed sizing for a perfect circle
    const baseSize = mini ? 'w-16 h-16' : 'w-20 h-20 md:w-24 md:h-24';

    if (isConnecting) return {
      size: baseSize,
      bg: 'bg-slate-900/95',
      border: 'border-indigo-500/30',
      icon: <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />,
      glow: 'shadow-[0_0_30px_rgba(79,70,229,0.3)]'
    };

    if (!isActive) return {
      size: baseSize,
      bg: 'bg-[#0a0a0f]/90 hover:bg-slate-900',
      border: 'border-white/10',
      icon: <Mic className="w-8 h-8 text-white/70 group-hover:text-white transition-colors" />,
      glow: 'shadow-2xl'
    };

    switch (state) {
      case 'listening':
        return {
          size: baseSize,
          bg: 'bg-purple-600',
          border: 'border-white/40',
          icon: <Radio className="w-8 h-8 text-white animate-pulse" />,
          glow: 'shadow-[0_0_50px_rgba(168,85,247,0.7)]'
        };
      case 'thinking':
        return {
          size: baseSize,
          bg: 'bg-purple-900/90',
          border: 'border-purple-400/50',
          icon: <Sparkles className="w-8 h-8 text-white animate-pulse" />,
          glow: 'shadow-[0_0_40px_rgba(168,85,247,0.5)]',
          showNeuralRing: true
        };
      case 'speaking':
        return {
          size: baseSize,
          bg: 'bg-slate-900',
          border: 'border-purple-500',
          isSpeaking: true,
          icon: null,
          glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]'
        };
      default:
        return {
          size: baseSize,
          bg: 'bg-slate-900',
          border: 'border-white/10',
          icon: <Mic className="w-8 h-8 text-white" />,
          glow: 'shadow-2xl'
        };
    }
  }, [isActive, isConnecting, state, mini]);

  return (
    <div className="relative flex items-center justify-center group">
       
       {/* Thinking Ring - Subtle spin around the border */}
       {state === 'thinking' && (
         <div className={`absolute inset-0 pointer-events-none z-0 ${config.size} scale-110`}>
            <div className="w-full h-full border-2 border-dashed border-purple-500/30 rounded-full animate-orb-spin" />
         </div>
       )}

       {/* The Main Orbital Component - Fixed Circle */}
       <button
         onClick={onClick}
         className={`relative flex items-center justify-center transition-all duration-500 ease-out backdrop-blur-3xl border-2 rounded-full ${config.bg} ${config.border} ${config.size} ${config.glow} overflow-hidden group outline-none active:scale-90 select-none`}
       >
          {/* Internal Glow Depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
          
          {/* Inner Content Layer */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {config.isSpeaking ? (
              <div className="scale-125">
                <VoiceWave isActive={true} barColor="bg-purple-400" />
              </div>
            ) : (
              <div className="transition-all duration-300">
                {config.icon}
              </div>
            )}
          </div>
          
          {/* Mobile Stop Trigger Overlay - Keeps the circle shape */}
          {isActive && (
             <div className="absolute inset-0 bg-red-600/0 hover:bg-red-600/90 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 group-active:bg-red-600/95">
                <Square className="w-8 h-8 text-white fill-current" />
             </div>
          )}

          {/* Bottom Shine Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
       </button>
    </div>
  );
};

export default OrbitalAssistant;