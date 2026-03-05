import { sendGAEvent } from '@next/third-parties/google';

interface EventParameters {
  [key: string]: string | number | boolean;
}

const isProduction = process.env.NODE_ENV === 'production';

export function trackEvent(eventName: string, parameters?: EventParameters): void {
  if (!isProduction) return;
  
  try {
    sendGAEvent('event', eventName, parameters || {});
  } catch (error) {
    console.error('Failed to send GA4 event:', error);
  }
}

let sessionStartTime: number | null = null;
let currentSessionId: string | null = null;

export function startSessionTracking(sessionId: string): void {
  if (!isProduction) return;
  
  try {
    currentSessionId = sessionId;
    sessionStartTime = Date.now();
    trackEvent('session_started', { session_id: sessionId });
  } catch (error) {
    console.error('Failed to start session tracking:', error);
  }
}

export function endSessionTracking(): void {
  if (!isProduction || !sessionStartTime || !currentSessionId) return;
  
  try {
    const sessionDurationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    trackEvent('session_ended', {
      session_id: currentSessionId,
      session_duration_seconds: sessionDurationSeconds,
    });
    
    currentSessionId = null;
    sessionStartTime = null;
  } catch (error) {
    console.error('Failed to end session tracking:', error);
  }
}

export function trackTimerModeChanged(mode: 'countdown' | 'countup' | 'clock'): void {
  trackEvent('timer_mode_changed', { mode });
}

export function trackTimerStarted(mode: 'countdown' | 'countup' | 'clock', duration: number): void {
  trackEvent('timer_started', { mode, duration });
}

export function trackTimerPaused(mode: 'countdown' | 'countup' | 'clock', remaining: number): void {
  trackEvent('timer_paused', { mode, remaining });
}

export function trackTimerReset(mode: 'countdown' | 'countup' | 'clock'): void {
  trackEvent('timer_reset', { mode });
}

export function trackTimerSet(durationMinutes: number): void {
  trackEvent('timer_set', { duration_minutes: durationMinutes });
}

export function trackSignalSent(
  signalType: 'speed_up' | 'wrap_up' | 'times_up' | 'custom',
  signalText: string,
  color: string
): void {
  trackEvent('signal_sent', {
    signal_type: signalType,
    signal_text: signalText,
    color,
  });
}

export function trackCustomMessageSent(messageLength: number): void {
  trackEvent('custom_message_sent', { message_length: messageLength });
}

export function trackPresetSaved(message: string): void {
  trackEvent('preset_saved', { message });
}

export function trackPresetRemoved(message: string): void {
  trackEvent('preset_removed', { message });
}

export function trackPresetUsed(message: string): void {
  trackEvent('preset_used', { message });
}

export function trackEffectToggled(
  effectType: 'flash' | 'invert' | 'animate',
  enabled: boolean
): void {
  trackEvent('effect_toggled', {
    effect_type: effectType,
    enabled,
  });
}

export function trackScreenCleared(): void {
  trackEvent('screen_cleared', {});
}

export function trackColorCustomized(
  signalType: 'speed_up' | 'wrap_up' | 'times_up',
  oldColor: string,
  newColor: string
): void {
  trackEvent('color_customized', {
    signal_type: signalType,
    old_color: oldColor,
    new_color: newColor,
  });
}

export function trackShareModalOpened(sessionId: string): void {
  trackEvent('share_modal_opened', { session_id: sessionId });
}

export function trackShareLinkCopied(sessionId: string): void {
  trackEvent('share_link_copied', { session_id: sessionId });
}

export function trackDisplayOpened(sessionId: string): void {
  trackEvent('display_opened', { session_id: sessionId });
}

export function trackSessionCreated(sessionId: string): void {
  trackEvent('session_created', { session_id: sessionId });
}

export function trackSessionJoined(sessionId: string): void {
  trackEvent('session_joined', { session_id: sessionId });
}
