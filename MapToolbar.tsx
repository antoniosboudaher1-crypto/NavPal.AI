
import React from 'react';
import { List } from 'lucide-react';

interface MapToolbarProps {
  showRouteList: boolean;
  onToggleRouteList: () => void;
  isNavigating: boolean;
  onToggleRouteOptions: () => void;
  showRouteOptions: boolean;
}

const MapToolbar: React.FC<MapToolbarProps> = ({
  showRouteList,
  onToggleRouteList,
  isNavigating,
}) => {
  return (
    <div className="absolute bottom-52 right-4 z-20 flex flex-col gap-3 pointer-events-auto items-end transition-all duration-300">
      
      {/* Toggle Route List (Nav Mode Only) */}
      {isNavigating && (
        <button 
          onClick={onToggleRouteList}
          className={`w-12 h-12 rounded-full backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-center transition-all active:scale-90 duration-200 ${showRouteList ? 'bg-purple-600 text-white' : 'bg-slate-950/50 text-white hover:bg-slate-900'}`}
          title="Route List"
        >
          <List className="w-6 h-6" />
        </button>
      )}

    </div>
  );
};

export default MapToolbar;
