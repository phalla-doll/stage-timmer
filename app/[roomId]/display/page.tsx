'use client';

import { useParams } from 'next/navigation';
import { useStageTimer } from '@/hooks/use-stage-timer';
import { useEffect, useState } from 'react';

export default function DisplayView() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { state, isConnected } = useStageTimer(roomId);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentTime(new Date()), 0);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const m = Math.floor(absSeconds / 60);
    const s = absSeconds % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If invertColors is true, we swap black and white
  const bgClass = state.invertColors ? 'bg-white' : 'bg-black';
  const textClass = state.invertColors ? 'text-black' : 'text-white';
  
  // Flash effect: toggles opacity every 500ms if flash is true
  const [isFlashing, setIsFlashing] = useState(false);
  useEffect(() => {
    if (!state.flash) {
      const timer = setTimeout(() => setIsFlashing(false), 0);
      return () => clearTimeout(timer);
    }
    const interval = setInterval(() => setIsFlashing(f => !f), 500);
    return () => clearInterval(interval);
  }, [state.flash]);

  if (!isConnected) {
    return (
      <div className={`min-h-screen ${bgClass} ${textClass} flex items-center justify-center font-sans`}>
        <div className="text-4xl font-bold opacity-50">Connecting to {roomId}...</div>
      </div>
    );
  }

  const isOvertime = state.remaining < 0;
  const timerColor = isOvertime ? 'text-red-500' : textClass;

  return (
    <div className={`relative overflow-hidden min-h-screen ${bgClass} ${textClass} flex flex-col items-center justify-between p-8 font-sans transition-colors duration-300 ${isFlashing ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Animated Background Layer */}
      {state.showAnimation && state.message && (
        <div 
          className="absolute inset-0 pointer-events-none animate-breathe z-0"
          style={{
            background: `radial-gradient(circle at center, ${state.messageColor} 0%, transparent 80%)`
          }}
        />
      )}

      {/* Message Area (Top) */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full">
        {state.message && (
          <div 
            className="text-6xl md:text-8xl lg:text-[8rem] font-mono font-bold tracking-tighter uppercase text-center leading-none"
            style={{ color: state.messageColor }}
          >
            {state.message}
          </div>
        )}
      </div>

      {/* Timer Area (Center) */}
      <div className={`relative z-10 flex-none text-[15vw] font-mono font-bold tracking-tighter tabular-nums leading-none ${timerColor}`}>
        {state.mode === 'clock' 
          ? (currentTime ? currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--') 
          : formatTime(state.remaining)}
      </div>

      {/* Progress Bar (Bottom) */}
      <div className="relative z-10 flex-1 flex items-end justify-center w-full pb-4 md:pb-12">
        {state.mode !== 'clock' && state.duration > 0 && (
          <div className="w-full max-w-5xl h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${isOvertime ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, Math.max(0, (state.remaining / state.duration) * 100))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
