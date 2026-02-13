
import React from 'react';
import { MapReport, ReportType, Theme } from '../../types';
import GlassCard from '../UI/GlassCard';
import { ShieldCheck, X, Clock, AlertCircle, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';

interface ReportDetailCardProps {
  report: MapReport;
  onClose: () => void;
  onConfirm: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  theme?: Theme;
}

const ReportDetailCard: React.FC<ReportDetailCardProps> = ({ 
  report, 
  onClose, 
  onConfirm, 
  onDismiss, 
  theme = 'dark' 
}) => {
  const isDark = theme === 'dark';
  
  const getReportInfo = (type: ReportType) => {
    switch (type) {
      case ReportType.ACCIDENT: return { label: 'Accident', color: 'text-rose-500', bg: 'bg-rose-500/10' };
      case ReportType.POLICE: return { label: 'Police', color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case ReportType.HAZARD: return { label: 'Hazard', color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case ReportType.TRAFFIC: return { label: 'Traffic', color: 'text-orange-500', bg: 'bg-orange-500/10' };
      default: return { label: 'Alert', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    }
  };

  const info = getReportInfo(report.type);
  const timeAgo = Math.floor((Date.now() - report.timestamp) / 60000);

  return (
    <div className="absolute bottom-24 left-0 right-0 z-[110] flex justify-center px-4 animate-slide-up pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto">
        <GlassCard theme={theme} className={`overflow-hidden rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-slate-950/95 border-white/10' : 'bg-white/95 border-slate-200'}`}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${info.bg} ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  <AlertCircle className={`w-8 h-8 ${info.color}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{info.label}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {timeAgo < 1 ? 'Just now' : `${timeAgo}m ago`}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-slate-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={`p-4 rounded-2xl mb-8 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verified by</span>
                <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {report.confirmations || 0} Pilots
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onConfirm(report.id)}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-black text-xs uppercase tracking-widest">Still There</span>
                </div>
              </button>

              <button 
                onClick={() => onDismiss(report.id)}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5" />
                  <span className="font-black text-xs uppercase tracking-widest">Gone</span>
                </div>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ReportDetailCard;
