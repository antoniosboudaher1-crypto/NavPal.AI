
import React from 'react';

interface VoiceWaveProps {
  isActive: boolean;
  barColor?: string;
}

const VoiceWave: React.FC<VoiceWaveProps> = ({ isActive, barColor = "bg-white" }) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center gap-1 h-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 rounded-full animate-wave ${barColor}`}
          style={{
            height: '100%',
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWave;
