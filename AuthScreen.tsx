import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import { loginUser, registerUser, loginAsGuest } from '../../services/auth';
import { CLOUDFLARE_SITE_KEY } from '../../constants';
import GlassCard from '../UI/GlassCard';
import { Lock, Mail, User as UserIcon, Loader2, Navigation, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    setCaptchaToken(null);
    setError('');

    const renderWidget = () => {
      // Fix: Use type casting to any for window.turnstile to avoid TS property errors
      const turnstile = (window as any).turnstile;
      if (!captchaRef.current || !turnstile) return;
      if (widgetId.current) try { turnstile.remove(widgetId.current); } catch (e) {}

      try {
        widgetId.current = turnstile.render(captchaRef.current, {
          sitekey: CLOUDFLARE_SITE_KEY,
          theme: 'dark',
          action: isLogin ? 'login' : 'signup',
          callback: (token: string) => setCaptchaToken(token),
        });
      } catch (e) {}
    };

    // Fix: Access turnstile on window via any casting
    const turnstile = (window as any).turnstile;
    if (turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        // Fix: Access turnstile on window via any casting
        if ((window as any).turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      // Fix: Access turnstile on window via any casting
      const turnstile = (window as any).turnstile;
      if (widgetId.current && turnstile) {
        try { turnstile.remove(widgetId.current); } catch (e) {}
        widgetId.current = null;
      }
    };
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let user;
      if (isLogin) {
        user = await loginUser(formData.email, formData.password, captchaToken || 'mock_token');
      } else {
        user = await registerUser(formData.name, formData.email, formData.password, captchaToken || 'mock_token');
      }
      onAuthSuccess(user);
    } catch (err: any) {
      // Clean up Firebase error messages
      const msg = err.message.replace('Firebase: ', '').replace(' (auth/invalid-credential).', '');
      setError(msg || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await loginAsGuest();
      onAuthSuccess(user);
    } catch (err: any) {
      setError('Guest login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617] overflow-hidden">
      
      {/* Background - Minimalist & Modern */}
      <div className="absolute inset-0 z-0">
         {/* Deep Void Base */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#050914] to-[#020617]" />
         
         {/* Subtle Tech Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

         {/* Ambient Glows - Soft & Diffused */}
         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] p-6 animate-zoom-in">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
           {/* Splash Screen Style Logo Container (Non-Animated) */}
           <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] mb-6 ring-1 ring-white/10 group hover:scale-105 transition-transform duration-500">
              <Navigation className="w-10 h-10 text-white fill-white/10 drop-shadow-xl" strokeWidth={2.5} /> 
              
              {/* Inner gloss effect for that premium app feel */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-40 pointer-events-none"></div>
           </div>
           
           <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl">
             NavPal<span className="text-purple-500">.</span>AI
           </h1>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
             Next Gen Navigation
           </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            {/* Top Gloss Shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
              
              {!isLogin && (
                <div className="relative group/input">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full h-12 bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-5 text-white placeholder-slate-600 focus:bg-slate-900 focus:border-purple-500/50 outline-none transition-all font-bold text-sm"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              )}

              <div className="relative group/input">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full h-12 bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-5 text-white placeholder-slate-600 focus:bg-slate-900 focus:border-purple-500/50 outline-none transition-all font-bold text-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
              </div>

              <div className="relative group/input">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-purple-400 transition-colors" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-12 bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-5 text-white placeholder-slate-600 focus:bg-slate-900 focus:border-purple-500/50 outline-none transition-all font-bold text-sm"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                  />
              </div>

              {/* Hidden Captcha */}
              <div className="fixed opacity-0 pointer-events-none w-px h-px">
                 <div ref={captchaRef}></div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse">
                  <Sparkles className="w-3 h-3" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 rounded-2xl" />
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

            </form>

            <div className="my-6 flex items-center gap-4">
               <div className="h-px bg-white/5 flex-1" />
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Or Continue With</span>
               <div className="h-px bg-white/5 flex-1" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  className="h-12 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 flex items-center justify-center gap-2 text-xs font-bold text-slate-300 transition-all active:scale-[0.98] group/guest"
              >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover/guest:scale-110 transition-transform" />
                  <span>Continue as Guest</span>
              </button>
            </div>

        </div>

        {/* Footer Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { setError(''); setIsLogin(!isLogin); }}
            className="text-xs text-slate-500 hover:text-white transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-purple-400 font-bold hover:underline">{isLogin ? 'Sign Up' : 'Log In'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;