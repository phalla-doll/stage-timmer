'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStageTimer } from '@/hooks/use-stage-timer';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayIcon, LayerMask01Icon, PauseIcon, RefreshIcon, Tv01Icon, Settings01Icon, FlashlightIcon, KeyframesMultipleIcon, Share01Icon, Copy01Icon, Tick01Icon, Cancel01Icon, PlusSignIcon, Home01Icon } from '@hugeicons/core-free-icons';
import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion } from 'motion/react';

const QRCode = lazy(() => import('react-qr-code'));
import {
  startSessionTracking,
  endSessionTracking,
  trackTimerModeChanged,
  trackTimerStarted,
  trackTimerPaused,
  trackTimerReset,
  trackTimerSet,
  trackSignalSent,
  trackCustomMessageSent,
  trackPresetSaved,
  trackPresetRemoved,
  trackPresetUsed,
  trackEffectToggled,
  trackScreenCleared,
  trackColorCustomized,
  trackShareModalOpened,
  trackShareLinkCopied,
  trackDisplayOpened,
} from '@/lib/analytics';

export default function OperatorView() {
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();
  const { state, isConnected, updateState } = useStageTimer(roomId);
  
  const [customMsg, setCustomMsg] = useState('');
  const [inputMinutes, setInputMinutes] = useState('5');

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [showColorPickers, setShowColorPickers] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [presets, setPresets] = useState<string[]>(() => {
    const saved = localStorage.getItem('stage-timer-presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse presets', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    startSessionTracking(roomId);
    return () => {
      endSessionTracking();
    };
  }, [roomId]);

  const savePreset = useCallback(() => {
    const msg = customMsg.trim().toUpperCase();
    if (msg && !presets.includes(msg)) {
      const newPresets = [...presets, msg];
      setPresets(newPresets);
      localStorage.setItem('stage-timer-presets', JSON.stringify(newPresets));
      trackPresetSaved(msg);
    }
  }, [customMsg, presets]);

  const removePreset = useCallback((preset: string) => {
    const newPresets = presets.filter(p => p !== preset);
    setPresets(newPresets);
    localStorage.setItem('stage-timer-presets', JSON.stringify(newPresets));
    trackPresetRemoved(preset);
  }, [presets]);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentTime(new Date()), 0);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const m = Math.floor(absSeconds / 60);
    const s = absSeconds % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const handleSetTime = useCallback(() => {
    const mins = parseInt(inputMinutes) || 0;
    const secs = mins * 60;
    trackTimerSet(mins);
    updateState({ duration: secs, remaining: secs, isRunning: false });
  }, [inputMinutes, updateState]);

  const toggleTimer = useCallback(() => {
    const isRunning = !state.isRunning;
    if (isRunning) {
      trackTimerStarted(state.mode, state.duration);
    } else {
      trackTimerPaused(state.mode, state.remaining);
    }
    updateState({ isRunning });
  }, [state.isRunning, state.mode, state.duration, state.remaining, updateState]);

  const resetTimer = useCallback(() => {
    trackTimerReset(state.mode);
    updateState({ remaining: state.duration, isRunning: false });
  }, [state.mode, state.duration, updateState]);

  const sendStatus = useCallback((msg: string, color: string) => {
    const signalType = msg === 'SPEED UP' ? 'speed_up' :
                      msg === 'WRAP UP' ? 'wrap_up' :
                      msg === "TIME'S UP" ? 'times_up' : 'custom';
    trackSignalSent(signalType, msg, color);
    updateState({ message: msg, messageColor: color });
  }, [updateState]);

  const clearMessage = useCallback(() => {
    trackScreenCleared();
    updateState({ message: '', messageColor: '#ffffff', flash: false });
  }, [updateState]);

  const toggleFlash = useCallback(() => {
    trackEffectToggled('flash', !state.flash);
    updateState({ flash: !state.flash });
  }, [state.flash, updateState]);

  const toggleInvert = useCallback(() => {
    trackEffectToggled('invert', !state.invertColors);
    updateState({ invertColors: !state.invertColors });
  }, [state.invertColors, updateState]);

  const toggleAnimation = useCallback(() => {
    trackEffectToggled('animate', !state.showAnimation);
    updateState({ showAnimation: !state.showAnimation });
  }, [state.showAnimation, updateState]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800 gap-4 sm:gap-0" role="banner">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white p-2.5 rounded-lg transition-colors"
              title="Back to Home"
              aria-label="Back to Home"
            >
              <HugeiconsIcon icon={Home01Icon} size={20} strokeWidth={1.5} />
            </motion.button>
            <div className="bg-zinc-800 px-4 py-1.5 rounded-lg font-mono text-xl tracking-widest font-bold">
              {roomId}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="hidden sm:inline">{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              trackShareModalOpened(roomId);
              setShowShareModal(true);
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-white p-2.5 rounded-lg transition-colors"
            title="Share Display"
            aria-label="Share Display"
          >
            <HugeiconsIcon icon={Share01Icon} size={20} strokeWidth={1.5} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              trackDisplayOpened(roomId);
              window.open(`/${roomId}/display`, '_blank');
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <HugeiconsIcon icon={Tv01Icon} size={20} strokeWidth={1.5} />
            <span className="hidden sm:inline">Open Display</span>
          </motion.button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Main Timer Controls */}
        <main className="lg:col-span-2 bg-zinc-900 rounded-3xl border border-zinc-800 p-4 sm:p-6 flex flex-col" role="main" id="main-content">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
            <h2 className="text-2xl font-bold text-zinc-400">Timer Control</h2>
            <div className="flex bg-zinc-800 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              {(['countdown', 'countup', 'clock'] as const).map(m => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={m}
                  onClick={() => {
                    trackTimerModeChanged(m);
                    updateState({ mode: m, isRunning: false });
                  }}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-bold capitalize transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                    state.mode === m ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {m}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12">
            <div className={`text-[15vw] sm:text-8xl md:text-[10rem] font-mono font-bold tracking-tighter tabular-nums leading-none ${state.remaining < 0 ? 'text-red-500' : 'text-white'}`}>
              {state.mode === 'clock' 
                ? (currentTime ? currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--') 
                : formatTime(state.remaining)}
            </div>
            
            {state.mode !== 'clock' && (
              <div className="flex items-center gap-4 mt-12">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                >
                  <HugeiconsIcon icon={RefreshIcon} size={32} strokeWidth={1.5} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                    state.isRunning ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  }`}
                >
                  {state.isRunning ? <HugeiconsIcon icon={PauseIcon} size={48} strokeWidth={1.5} /> : <HugeiconsIcon icon={PlayIcon} size={48} strokeWidth={1.5} className="ml-2" />}
                </motion.button>
              </div>
            )}
          </div>

          {state.mode !== 'clock' && (
            <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-wrap items-center gap-4">
              <label htmlFor="minutes-input" className="sr-only">Minutes</label>
              <input
                id="minutes-input"
                type="number"
                value={inputMinutes}
                onChange={e => setInputMinutes(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xl font-mono font-bold w-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                placeholder="Min"
              />
              <span className="text-zinc-500 font-bold">MINUTES</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSetTime}
                className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-bold transition-colors sm:ml-auto"
              >
                Set Time
              </motion.button>
            </div>
          )}
        </main>

        {/* Status Controls */}
        <aside className="bg-zinc-900 rounded-3xl border border-zinc-800 p-4 sm:p-6 flex flex-col gap-6" role="complementary">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-400">Signals</h2>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowColorPickers(!showColorPickers)}
              className={`p-2 rounded-lg transition-colors ${showColorPickers ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}
              title="Toggle Signal Colors"
              aria-label="Toggle Signal Colors"
            >
              <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.5} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative flex items-stretch gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => sendStatus('SPEED UP', state.signalColors.speedUp)}
                className="flex-1 border-2 p-4 rounded-2xl font-bold text-lg transition-colors"
                style={{ color: '#ffffff', borderColor: state.signalColors.speedUp, backgroundColor: `${state.signalColors.speedUp}20` }}
              >
                Speed Up
              </motion.button>
              {showColorPickers && (
                <div className="relative w-12 flex-shrink-0">
                  <label htmlFor="speedup-color" className="sr-only">Speed Up Color</label>
                  <input
                    id="speedup-color"
                    type="color"
                    value={state.signalColors.speedUp}
                    onChange={e => {
                      trackColorCustomized('speed_up', state.signalColors.speedUp, e.target.value);
                      updateState({ signalColors: { ...state.signalColors, speedUp: e.target.value }});
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-full h-full rounded-2xl border flex items-center justify-center pointer-events-none"
                    style={{ backgroundColor: `${state.signalColors.speedUp}20`, borderColor: `${state.signalColors.speedUp}40` }}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-900" style={{ backgroundColor: state.signalColors.speedUp }} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative flex items-stretch gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => sendStatus('WRAP UP', state.signalColors.wrapUp)}
                className="flex-1 border-2 p-4 rounded-2xl font-bold text-lg transition-colors"
                style={{ color: '#ffffff', borderColor: state.signalColors.wrapUp, backgroundColor: `${state.signalColors.wrapUp}20` }}
              >
                Wrap Up
              </motion.button>
              {showColorPickers && (
                <div className="relative w-12 flex-shrink-0">
                  <label htmlFor="wrapup-color" className="sr-only">Wrap Up Color</label>
                  <input
                    id="wrapup-color"
                    type="color"
                    value={state.signalColors.wrapUp}
                    onChange={e => {
                      trackColorCustomized('wrap_up', state.signalColors.wrapUp, e.target.value);
                      updateState({ signalColors: { ...state.signalColors, wrapUp: e.target.value }});
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-full h-full rounded-2xl border flex items-center justify-center pointer-events-none"
                    style={{ backgroundColor: `${state.signalColors.wrapUp}20`, borderColor: `${state.signalColors.wrapUp}40` }}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-900" style={{ backgroundColor: state.signalColors.wrapUp }} />
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex items-stretch gap-2 sm:col-span-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => sendStatus("TIME'S UP", state.signalColors.timesUp)}
                className="flex-1 border-2 p-4 rounded-2xl font-bold text-lg transition-colors"
                style={{ color: '#ffffff', borderColor: state.signalColors.timesUp, backgroundColor: `${state.signalColors.timesUp}20` }}
              >
                Time&apos;s Up
              </motion.button>
              {showColorPickers && (
                <div className="relative w-14 flex-shrink-0">
                  <label htmlFor="timesup-color" className="sr-only">Time&apos;s Up Color</label>
                  <input
                    id="timesup-color"
                    type="color"
                    value={state.signalColors.timesUp}
                    onChange={e => {
                      trackColorCustomized('times_up', state.signalColors.timesUp, e.target.value);
                      updateState({ signalColors: { ...state.signalColors, timesUp: e.target.value }});
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-full h-full rounded-2xl border flex items-center justify-center pointer-events-none"
                    style={{ backgroundColor: `${state.signalColors.timesUp}20`, borderColor: `${state.signalColors.timesUp}40` }}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-900" style={{ backgroundColor: state.signalColors.timesUp }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider text-wrap: balance">Custom Message</h3>
            <div className="flex gap-2">
              <label htmlFor="custom-message-input" className="sr-only">Custom Message</label>
              <div className="relative flex-1">
                <input
                  id="custom-message-input"
                  type="text"
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  placeholder="Enter message..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pr-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      trackCustomMessageSent(customMsg.length);
                      sendStatus(customMsg.toUpperCase(), '#ffffff');
                    }
                  }}
                />
                {customMsg.trim() && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCustomMsg('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    title="Clear input"
                    aria-label="Clear input"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} />
                  </motion.button>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={savePreset}
                disabled={!customMsg.trim()}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-3 rounded-xl transition-colors flex items-center justify-center"
                title="Save as preset"
                aria-label="Save as preset"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={1.5} />
              </motion.button>
              <motion.button
                whileTap={messageSent ? undefined : { scale: 0.95 }}
                onClick={() => {
                  trackCustomMessageSent(customMsg.length);
                  sendStatus(customMsg.toUpperCase(), '#ffffff');
                  setMessageSent(true);
                  setTimeout(() => setMessageSent(false), 2000);
                }}
                disabled={messageSent}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                {messageSent ? (
                  <>
                    <HugeiconsIcon icon={Tick01Icon} size={20} strokeWidth={1.5} color="#10b981" />
                    Sent
                  </>
                ) : (
                  'Send'
                )}
              </motion.button>
            </div>
            
            {presets.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {presets.map(preset => (
                  <div key={preset} className="flex items-center bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg overflow-hidden transition-colors group">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        trackPresetUsed(preset);
                        setCustomMsg(preset);
                      }}
                      className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      {preset}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removePreset(preset)}
                      className="px-2 py-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                      title="Remove preset"
                      aria-label={`Remove preset: ${preset}`}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.5} />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-800 space-y-4 mt-auto">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider text-wrap: balance">Display Effects</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleFlash}
                className={`p-3 sm:p-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  state.flash ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                <HugeiconsIcon icon={FlashlightIcon} size={20} strokeWidth={1.5} />
                <span className="hidden sm:inline">Flash</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleInvert}
                className={`p-3 sm:p-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  state.invertColors ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
            <HugeiconsIcon icon={LayerMask01Icon} size={20} strokeWidth={1.5} />
                <span className="hidden sm:inline">Invert</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleAnimation}
                className={`p-3 sm:p-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  state.showAnimation ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                <HugeiconsIcon icon={KeyframesMultipleIcon} size={20} strokeWidth={1.5} />
                <span className="hidden sm:inline">Animate</span>
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={clearMessage}
              className="w-full bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl font-bold text-lg transition-colors text-zinc-400"
            >
              Clear Screen
            </motion.button>
          </div>
        </aside>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-6 relative" style={{ overscrollBehavior: 'contain' }}>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              aria-label="Close share modal"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} strokeWidth={1.5} />
            </motion.button>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">Share Display</h3>
              <p className="text-zinc-400 text-sm">Scan to open the display on another device</p>
            </div>

            <div className="bg-white p-4 rounded-2xl">
              <Suspense fallback={<div className="w-[200px] h-[200px] bg-zinc-200 rounded-2xl animate-pulse" />}>
                <QRCode value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${roomId}/display`} size={200} />
              </Suspense>
            </div>

            <div className="w-full space-y-2">
              <label htmlFor="display-link-input" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Display Link</label>
              <div className="flex gap-2">
                <input 
                  id="display-link-input"
                  type="text" 
                  readOnly 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${roomId}/display`}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    trackShareLinkCopied(roomId);
                    navigator.clipboard.writeText(`${window.location.origin}/${roomId}/display`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
                >
                  {copied ? <HugeiconsIcon icon={Tick01Icon} size={20} strokeWidth={1.5} color="#10b981" /> : <HugeiconsIcon icon={Copy01Icon} size={20} strokeWidth={1.5} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
