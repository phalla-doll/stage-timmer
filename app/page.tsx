'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tv01Icon, PlusSignSquareIcon } from '@hugeicons/core-free-icons';
import { motion } from 'motion/react';
import { trackSessionCreated, trackSessionJoined } from '@/lib/analytics';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      trackSessionJoined(roomId);
      router.push(`/${roomId}/operator`);
    }
  };

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    trackSessionCreated(newRoomId);
    router.push(`/${newRoomId}/operator`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tighter mb-2">STAGE TIMER</h1>
          <p className="text-zinc-400">Professional stage control system</p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 space-y-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={createRoom}
            className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <HugeiconsIcon icon={PlusSignSquareIcon} size={24} strokeWidth={1.5} />
            Create New Session
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-zinc-500">OR JOIN EXISTING</span>
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-center text-2xl font-mono font-bold tracking-widest focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                maxLength={6}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!roomId.trim()}
              className="w-full bg-zinc-800 text-white font-bold text-lg py-4 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <HugeiconsIcon icon={Tv01Icon} size={24} strokeWidth={1.5} />
              Join Session
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
