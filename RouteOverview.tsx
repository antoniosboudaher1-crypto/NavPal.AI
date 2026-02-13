
import React, { useState } from 'react';
import { NavigationRoute, RouteStep } from '../../types';
import GlassCard from '../UI/GlassCard';
import { Clock, MapPin, Navigation, ArrowRight, ArrowLeft, ArrowUp, ChevronDown, ChevronUp, X, Flag, Timer, Ban, List, Gauge } from 'lucide-react';

interface RouteOverviewProps {
  route: NavigationRoute;
  isPreview: boolean;
  onClose: () => void;
  onStartNavigation?: () => void;
  onStopNavigation?: () => void;
}

const getIconForManeuver = (type: string, modifier?: string) => {
  if (type === 'turn') {
    if (modifier?.includes('left')) return <ArrowLeft className="w-5 h-5 text-white" />;
    if (modifier?.includes('right')) return <ArrowRight className="w-5 h-5 text-white" />;
  }
  if (type === 'arrive') return <Flag className="w-5 h-5 text-green-400" />;
  return <ArrowUp className="w-5 h-5 text-slate-300" />;
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} hr ${m} min`;
  return `${m} min`;
};

const formatDistance = (meters: number) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const RouteOverview: React.FC<RouteOverviewProps> = ({ route, isPreview, onClose, onStartNavigation, onStopNavigation }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Calculate Arrival Time
  const arrivalTime = new Date(Date.now() + route.duration * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  // Trackers for the loop
  let cumulativeTime = 0;
  let cumulativeDistance = 0;

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className={`absolute top-24 right-6 z-30 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isCollapsed ? 'w-auto' : 'w-full max-w-md'} animate-slide-in-right`}>
      <GlassCard className="flex flex-col overflow-hidden border border-white/10 bg-slate-900/95 shadow-2xl rounded-2xl">
        
        {/* Header (Always Visible) */}
        <div className="p-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-white/5 flex justify-between items-start cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-green-400">{formatDuration(route.duration)}</h3>
              <span className="text-slate-400 font-medium">({formatDistance(route.distance)})</span>
            </div>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              Arrival <span className="text-white font-bold">{arrivalTime}</span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
            >
              {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {!isCollapsed && (
          <>
            {/* Primary Actions Area */}
            <div className="p-4 bg-slate-900/50 border-b border-white/5 space-y-3">
              
              {/* Start Button (Preview Mode) */}
              {isPreview && onStartNavigation && (
                <button
                  onClick={onStartNavigation}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Navigation className="w-5 h-5" />
                  Start Trip
                </button>
              )}

              {/* Cancel Button (Active Mode) */}
              {!isPreview && onStopNavigation && (
                <button
                  onClick={onStopNavigation}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                  <Ban className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Cancel Mission
                </button>
              )}
            </div>

            {/* Steps Toggle Header */}
            <button 
              onClick={() => setShowSteps(!showSteps)}
              className="w-full p-3 bg-slate-900/30 border-b border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors group"
            >
               <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-400 transition-colors">
                 <List className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-wider">Directions ({route.steps.length})</span>
               </div>
               {showSteps ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Steps List Panel (Collapsible) */}
            {showSteps && (
              <div className="relative animate-slide-down">
                {/* Top-to-bottom gradient mask for smooth scroll appearance */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent z-20 pointer-events-none" />

                <div className="overflow-y-auto max-h-[40vh] no-scrollbar p-2 space-y-1 bg-slate-950/30">
                  {route.steps.map((step, idx) => {
                    // Calculate Remaining Metrics FROM this step to Destination
                    const remainingDistance = Math.max(0, route.distance - cumulativeDistance);
                    const remainingTime = Math.max(0, route.duration - cumulativeTime);
                    
                    // Update cumulative for next iteration
                    cumulativeDistance += step.distance;
                    cumulativeTime += step.duration;

                    const isLast = idx === route.steps.length - 1;
                    const isExpanded = expandedStep === idx;
                    
                    return (
                      <div 
                        key={idx} 
                        onClick={() => toggleStep(idx)}
                        className={`relative flex flex-col p-3 rounded-xl transition-all cursor-pointer border border-transparent group ${isExpanded ? 'bg-white/5 border-white/10 shadow-lg' : 'hover:bg-white/5'}`}
                      >
                        
                        {/* Continuous Timeline Line */}
                        {!isLast && (
                           <div className="absolute left-[27px] top-10 bottom-[-10px] w-0.5 bg-slate-800 -z-0"></div>
                        )}

                        <div className="flex gap-4 items-start z-10">
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-md transition-transform group-hover:scale-110 ${idx === 0 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            {getIconForManeuver(step.maneuver.type, step.maneuver.modifier)}
                          </div>

                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex justify-between items-start">
                                <p className={`font-medium text-sm leading-snug transition-colors ${isExpanded ? 'text-white' : 'text-slate-200'}`}>
                                    {step.instruction}
                                </p>
                                <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-purple-400' : ''}`} />
                            </div>
                            
                            {/* Short Summary (Visible when collapsed) */}
                            {!isExpanded && (
                                <div className="flex items-center gap-2 mt-2">
                                     <span className="text-[10px] text-slate-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded-full">
                                         {formatDistance(step.distance)}
                                     </span>
                                </div>
                            )}
                          </div>
                        </div>

                        {/* Detailed Expanded View */}
                        {isExpanded && (
                           <div className="ml-12 mt-3 pt-3 border-t border-white/5 animate-slide-down">
                               <div className="grid grid-cols-2 gap-2 mb-3">
                                   <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
                                       <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Dist</span>
                                       <span className="text-white text-sm font-medium flex items-center gap-1">
                                           <Navigation className="w-3 h-3 text-blue-400" />
                                           {formatDistance(step.distance)}
                                       </span>
                                   </div>
                                   <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
                                       <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Time</span>
                                       <span className="text-white text-sm font-medium flex items-center gap-1">
                                           <Timer className="w-3 h-3 text-purple-400" />
                                           {formatDuration(step.duration)}
                                       </span>
                                   </div>
                                   {step.speedLimit && (
                                       <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5 col-span-2 flex items-center justify-between">
                                           <div>
                                             <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Limit</span>
                                             <span className="text-white text-sm font-bold">{step.speedLimit} {step.speedLimitUnit || 'km/h'}</span>
                                           </div>
                                           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                              <Gauge className="w-5 h-5 text-red-400" />
                                           </div>
                                       </div>
                                   )}
                               </div>

                               <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-950/50 p-2 rounded-lg">
                                   <Flag className="w-3 h-3 text-green-500" />
                                   <span>{formatDistance(remainingDistance)} left</span>
                               </div>
                           </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Destination Marker */}
                  <div className="flex gap-4 p-3 items-center pb-6">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0 text-white shadow-lg shadow-green-900/50 border-2 border-slate-900 z-10">
                        <Flag className="w-4 h-4" />
                    </div>
                    <span className="text-white font-bold text-sm">Destination</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default RouteOverview;
