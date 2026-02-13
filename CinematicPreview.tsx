
import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, AlertCircle, Key, Play, Info } from 'lucide-react';
import GlassCard from './GlassCard';
import { generateCinematicPreview } from '../../services/video';

interface CinematicPreviewProps {
  placeName: string;
  onClose: () => void;
}

const CinematicPreview: React.FC<CinematicPreviewProps> = ({ placeName, onClose }) => {
  const [step, setStep] = useState<'key_check' | 'generating' | 'ready' | 'error'>('key_check');
  const [statusMessage, setStatusMessage] = useState('Getting ready...');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    checkKeyAndStart();
  }, []);

  const checkKeyAndStart = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setStep('key_check');
    } else {
      startGeneration();
    }
  };

  const handleOpenKeySelector = async () => {
    await (window as any).aistudio.openSelectKey();
    // Proceed immediately to generation per race condition instructions
    startGeneration();
  };

  const startGeneration = async () => {
    setStep('generating');
    try {
      const url = await generateCinematicPreview(placeName, setStatusMessage);
      if (url) {
        setVideoUrl(url);
        setStep('ready');
      }
    } catch (err: any) {
      if (err.message === 'KEY_RESET_REQUIRED') {
        setErrorMsg("API key error. Please select a paid project key.");
        setStep('key_check');
      } else {
        setErrorMsg(err.message || "Failed to load video.");
        setStep('error');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-3xl animate-fade-in p-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl animate-zoom-in">
        <GlassCard className="overflow-hidden bg-[#050508]/95 border border-white/10 rounded-[3rem] shadow-[0_50px_150px_rgba(168,85,247,0.3)]">
          
          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={onClose}
              className="p-3 rounded-full bg-slate-900/80 border border-white/10 text-slate-500 hover:text-white transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="aspect-video relative bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden">
             
             {/* Background Atmosphere */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
             </div>

             {step === 'key_check' && (
               <div className="flex flex-col items-center text-center space-y-8 max-w-md animate-slide-up">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                    <Key className="w-10 h-10 text-indigo-400" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Video Preview</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      To create AI video previews, you need to select a <span className="text-indigo-400 font-bold">Paid API Key</span>.
                    </p>
                    <a 
                      href="https://ai.google.dev/gemini-api/docs/billing" 
                      target="_blank" 
                      className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:underline"
                    >
                      <Info className="w-3 h-3" />
                      About Billing
                    </a>
                  </div>
                  <button 
                    onClick={handleOpenKeySelector}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/40 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Select API Key
                    <Sparkles className="w-4 h-4" />
                  </button>
               </div>
             )}

             {step === 'generating' && (
               <div className="flex flex-col items-center text-center space-y-10 animate-fade-in">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
                    <div className="w-32 h-32 rounded-full border-[6px] border-slate-900 border-t-purple-500 animate-spin flex items-center justify-center relative z-10">
                       <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-xl font-black text-white uppercase tracking-widest">{statusMessage}</h3>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] animate-pulse">Creating your preview</p>
                  </div>
               </div>
             )}

             {step === 'ready' && videoUrl && (
               <div className="absolute inset-0 flex items-center justify-center animate-zoom-in">
                  <video 
                    src={videoUrl} 
                    autoPlay 
                    loop 
                    controls 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-8 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                     <Play className="w-3 h-3 text-emerald-400 fill-current" />
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">Preview: {placeName}</span>
                  </div>
               </div>
             )}

             {step === 'error' && (
               <div className="flex flex-col items-center text-center space-y-6 animate-slide-up">
                  <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white uppercase">Something went wrong</h3>
                    <p className="text-slate-500 text-sm max-w-xs">{errorMsg}</p>
                  </div>
                  <button 
                    onClick={startGeneration}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Try again
                  </button>
               </div>
             )}

          </div>

          <div className="px-10 py-5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${step === 'ready' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Video Engine 3.1</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-slate-800 uppercase tracking-[0.2em]">NavPal Interface</span>
             </div>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};

export default CinematicPreview;
