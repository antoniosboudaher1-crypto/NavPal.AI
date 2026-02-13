
import React from 'react';
import { Theme } from '../../types';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  theme?: Theme;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-slate-200'} border shadow-2xl rounded-3xl ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
