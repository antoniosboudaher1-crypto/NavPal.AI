
import React, { useEffect, useState } from 'react';
import { Navigation } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
      
      {/* Central Pulsating Core Layer - Life360 Style */}
      <div className="relative flex items-center justify-center">
        
        {/* Multiple expanding ripple layers */}
        {[0, 1, 2, 3].map((i) => (
           <div 
             key={i}
             className="absolute rounded-full bg-purple-600/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"
             style={{ 
               width: '8rem', // Base size matching the logo container
               height: '8rem',
               animationDelay: `${i * 0.5}s` 
             }}
           />
        ))}

        {/* Solid background glow behind logo to hide ripples starting point */}
        <div className="absolute w-40 h-40 bg-purple-600/20 blur-2xl rounded-full"></div>

        {/* Main Logo Container */}
        <div className={`relative z-10 w-32 h-32 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.6)] transition-all duration-1000 transform ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
           <Navigation className="w-14 h-14 text-white fill-white/10 drop-shadow-xl" />
           
           {/* Inner gloss effect for that premium app feel */}
           <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-40 pointer-events-none"></div>
        </div>
      </div>

      {/* Brand Text */}
      <div className={`mt-16 flex flex-col items-center transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-5xl font-black text-white tracking-tighter mb-3 drop-shadow-2xl">
          NavPal<span className="text-purple-500">.</span>AI
        </h1>
        
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
           <div className="flex gap-1.5">
             {[0, 1, 2].map((i) => (
               <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
             ))}
           </div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Connecting</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] opacity-50">
        Navigation Evolved
      </div>

    </div>
  );
};

export default SplashScreen;
