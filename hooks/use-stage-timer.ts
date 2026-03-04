import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface RoomState {
  mode: 'countdown' | 'countup' | 'clock';
  duration: number; // For progress bar
  remaining: number; // Current time in seconds
  isRunning: boolean;
  message: string;
  messageColor: string;
  flash: boolean;
  invertColors: boolean;
}

export function useStageTimer(roomId: string) {
  const [state, setState] = useState<RoomState>({
    mode: 'countdown',
    duration: 300,
    remaining: 300,
    isRunning: false,
    message: '',
    messageColor: 'text-white',
    flash: false,
    invertColors: false,
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io({
      path: '/socket.io',
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', roomId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('sync', (newState: RoomState) => {
      setState(newState);
    });

    socket.on('tick', (remaining: number) => {
      setState(prev => ({ ...prev, remaining }));
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const updateState = (newState: Partial<RoomState>) => {
    if (socketRef.current) {
      socketRef.current.emit('update-state', roomId, newState);
      setState(prev => ({ ...prev, ...newState })); // Optimistic update
    }
  };

  return { state, isConnected, updateState };
}
