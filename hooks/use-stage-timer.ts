import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export interface RoomState {
  mode: 'countdown' | 'countup' | 'clock';
  duration: number; // For progress bar
  remaining: number; // Current time in seconds
  isRunning: boolean;
  message: string;
  messageColor: string;
  flash: boolean;
  invertColors: boolean;
  showAnimation: boolean;
  signalColors: {
    speedUp: string;
    wrapUp: string;
    timesUp: string;
  };
}

export function useStageTimer(roomId: string) {
  const room = useQuery(api.rooms.get, { roomId });
  const joinRoom = useMutation(api.rooms.join);
  const updateRoom = useMutation(api.rooms.update);

  const [localRemaining, setLocalRemaining] = useState(300);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (room === undefined) return;
    if (room === null) {
      try {
        joinRoom({ roomId });
      } catch (err) {
        console.error('Error joining room:', err);
        setError('Failed to join room. Please try again.');
      }
      return;
    }

    let animationFrameId: number;

    const tick = () => {
      if (room.status === 'paused') {
        setLocalRemaining(room.pausedRemaining);
      } else {
        const now = Date.now();
        const elapsedSeconds = (now - room.referenceTime) / 1000;
        if (room.mode === 'countdown') {
          setLocalRemaining(room.pausedRemaining - elapsedSeconds);
        } else if (room.mode === 'countup') {
          setLocalRemaining(room.pausedRemaining + elapsedSeconds);
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [room, joinRoom, roomId]);

  const updateState = (newState: Partial<RoomState>) => {
    if (!room) return;

    try {
      const updates: any = { roomId };

      if (newState.message !== undefined) updates.message = newState.message;
      if (newState.messageColor !== undefined) updates.messageColor = newState.messageColor;
      if (newState.flash !== undefined) updates.flash = newState.flash;
      if (newState.invertColors !== undefined) updates.invertColors = newState.invertColors;
      if (newState.showAnimation !== undefined) updates.showAnimation = newState.showAnimation;
      if (newState.signalColors !== undefined) updates.signalColors = newState.signalColors;
      if (newState.mode !== undefined) updates.mode = newState.mode;
      if (newState.duration !== undefined) updates.duration = newState.duration;

      // Handle play/pause
      if (newState.isRunning !== undefined) {
        if (newState.isRunning) {
          updates.status = 'running';
          updates.referenceTime = Date.now();
          // pausedRemaining stays the same
        } else {
          updates.status = 'paused';
          updates.pausedRemaining = localRemaining;
        }
      }

      // Handle setting time manually
      if (newState.remaining !== undefined) {
        updates.pausedRemaining = newState.remaining;
        if (room.status === 'running') {
          updates.referenceTime = Date.now();
        }
      }

      updateRoom(updates);
    } catch (err) {
      console.error('Error updating room state:', err);
      setError('Failed to update room state. Please try again.');
    }
  };

  const state: RoomState = {
    mode: room?.mode || 'countdown',
    duration: room?.duration || 300,
    remaining: room?.mode === 'countup' ? Math.floor(localRemaining) : Math.ceil(localRemaining),
    isRunning: room?.status === 'running',
    message: room?.message || '',
    messageColor: room?.messageColor || '#ffffff',
    flash: room?.flash || false,
    invertColors: room?.invertColors || false,
    showAnimation: room?.showAnimation || false,
    signalColors: room?.signalColors || {
      speedUp: '#fbbf24',
      wrapUp: '#f97316',
      timesUp: '#ef4444',
    },
  };

  return { state, isConnected: room !== undefined, updateState, error };
}
