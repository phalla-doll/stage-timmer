'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStageTimer } from '@/hooks/use-stage-timer';
import { Play, Pause, RotateCcw, Monitor, Settings, AlertTriangle, MessageSquare, Zap, Sparkles, Share, Copy, Check, X, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'motion/react';

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
  const [presets, setPresets] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('stage-timer-presets');
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse presets', e);
      }
    }
  }, []);

  const savePreset = () => {
    const msg = customMsg.trim().toUpperCase();
    if (msg && !presets.includes(msg)) {
      const newPresets = [...presets, msg];
      setPresets(newPresets);
      localStorage.setItem('stage-timer-presets', JSON.stringify(newPresets));
    }
  };

  const removePreset = (preset: string) => {
    const newPresets = presets.filter(p => p !== preset);
    setPresets(newPresets);
    localStorage.setItem('stage-timer-presets', JSON.stringify(newPresets));
  };

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

  const handleSetTime = () => {
    const mins = parseInt(inputMinutes) || 0;
    const secs = mins * 60;
    updateState({ duration: secs, remaining: secs, isRunning: false });
  };

  const toggleTimer = () => {
    updateState({ isRunning: !state.isRunning });
  };

  const resetTimer = () => {
    updateState({ remaining: state.duration, isRunning: false });
  };

  const sendStatus = (msg: string, color: string) => {
    updateState({ message: msg, messageColor: color });
  };

  const clearMessage = () => {
    updateState({ message: '', messageColor: '#ffffff', flash: false });
  };

  const toggleFlash = () => {
    updateState({ flash: !state.flash });
  };

  const toggleInvert = () => {
    updateState({ invertColors: !state.invertColors });
  };

  const toggleAnimation = () => {
    updateState({ showAnimation: !state.showAnimation });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="bg-zinc-800 px-4 py-2 rounded-lg font-mono text-xl tracking-widest font-bold">
            {roomId}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareModal(true)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors"
            title="Share Display"
          >
            <Share className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`/${roomId}/display`, '_blank')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Monitor className="w-5 h-5" />
            <span className="hidden sm:inline">Open Display</span>
          </motion.button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Main Timer Controls */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-400">Timer Control</h2>
            <div className="flex bg-zinc-800 rounded-lg p-1">
              {(['countdown', 'countup', 'clock'] as const).map(m => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={m}
                  onClick={() => updateState({ mode: m, isRunning: false })}
                  className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-colors ${
                    state.mode === m ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {m}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className={`text-8xl md:text-[10rem] font-mono font-bold tracking-tighter tabular-nums leading-none ${state.remaining < 0 ? 'text-red-500' : 'text-white'}`}>
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
                  <RotateCcw className="w-8 h-8" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                    state.isRunning ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  }`}
                >
                  {state.isRunning ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
                </motion.button>
              </div>
            )}
          </div>

          {state.mode !== 'clock' && (
            <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center gap-4">
              <input
                type="number"
                value={inputMinutes}
                onChange={e => setInputMinutes(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xl font-mono font-bold w-24 focus:outline-none focus:border-zinc-600"
                placeholder="Min"
              />
              <span className="text-zinc-500 font-bold">MINUTES</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSetTime}
                className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-bold transition-colors ml-auto"
              >
                Set Time
              </motion.button>
            </div>
          )}
        </div>

        {/* Status Controls */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-400">Signals</h2>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowColorPickers(!showColorPickers)}
              className={`p-2 rounded-lg transition-colors ${showColorPickers ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}
              title="Toggle Signal Colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <input
                    type="color"
                    value={state.signalColors.speedUp}
                    onChange={e => updateState({ signalColors: { ...state.signalColors, speedUp: e.target.value }})}
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
                  <input
                    type="color"
                    value={state.signalColors.wrapUp}
                    onChange={e => updateState({ signalColors: { ...state.signalColors, wrapUp: e.target.value }})}
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

            <div className="relative flex items-stretch gap-2 col-span-2">
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
                  <input
                    type="color"
                    value={state.signalColors.timesUp}
                    onChange={e => updateState({ signalColors: { ...state.signalColors, timesUp: e.target.value }})}
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
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Custom Message</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder="Enter message..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-600"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    sendStatus(customMsg.toUpperCase(), '#ffffff');
                  }
                }}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={savePreset}
                disabled={!customMsg.trim()}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-3 rounded-xl transition-colors flex items-center justify-center"
                title="Save as preset"
              >
                <Plus className="w-5 h-5 text-zinc-300" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => sendStatus(customMsg.toUpperCase(), '#ffffff')}
                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-xl font-bold transition-colors"
              >
                Send
              </motion.button>
            </div>
            
            {presets.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {presets.map(preset => (
                  <div key={preset} className="flex items-center bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg overflow-hidden transition-colors group">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCustomMsg(preset)}
                      className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      {preset}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removePreset(preset)}
                      className="px-2 py-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                      title="Remove preset"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-800 space-y-4 mt-auto">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Display Effects</h3>
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleFlash}
                className={`p-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  state.flash ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span className="hidden sm:inline">Flash</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleInvert}
                className={`p-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  state.invertColors ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="hidden sm:inline">Invert</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleAnimation}
                className={`p-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  state.showAnimation ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                <Sparkles className="w-5 h-5" />
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
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-6 relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">Share Display</h3>
              <p className="text-zinc-400 text-sm">Scan to open the display on another device</p>
            </div>

            <div className="bg-white p-4 rounded-2xl">
              <QRCode value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${roomId}/display`} size={200} />
            </div>

            <div className="w-full space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Display Link</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${roomId}/display`}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${roomId}/display`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-white" />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
