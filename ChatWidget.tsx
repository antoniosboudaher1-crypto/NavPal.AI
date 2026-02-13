
import React from 'react';
import GlassCard from './GlassCard';
import ChatHistory from '../Sidebar/ChatHistory';
import { ChatMessage } from '../../types';
import { MessageSquare, X, Shield, Activity } from 'lucide-react';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, messages, onFeedback }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full animate-slide-in-right">
      <GlassCard className="overflow-hidden bg-[#0a0a0f]/98 border-t-2 border-purple-500 shadow-[0_20px_80px_rgba(168,85,247,0.3)] rounded-[2.5rem]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-purple-950/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Tactical Comms</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area - Scrollable with momentum */}
        <div className="p-5 max-h-[40vh] min-h-[120px] overflow-y-auto custom-scrollbar bg-slate-950/40 overscroll-contain">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-600 gap-4 opacity-50">
               <MessageSquare className="w-10 h-10" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Channel Silent</p>
            </div>
          ) : (
            <ChatHistory messages={messages} onFeedback={onFeedback} />
          )}
        </div>

        {/* Dynamic Activity Accent */}
        <div className="h-[2px] w-full bg-purple-500/10 overflow-hidden">
           <div className="h-full bg-purple-400 animate-[slideInRight_4s_linear_infinite] w-1/3 shadow-[0_0_10px_rgba(168,85,247,1)]" />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/5 bg-slate-950 flex items-center justify-between">
           <Shield className="w-3.5 h-3.5 text-slate-800" />
           <div className="flex items-center gap-2">
             <Activity className="w-3 h-3 text-purple-900" />
             <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.4em]">Grid Comms Encrypted</span>
           </div>
           <Shield className="w-3.5 h-3.5 text-slate-800" />
        </div>
      </GlassCard>
    </div>
  );
};

export default ChatWidget;
