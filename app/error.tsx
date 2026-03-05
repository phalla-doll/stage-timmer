'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4 font-sans">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-4xl font-bold text-red-500">Something went wrong!</h2>
        <p className="text-zinc-400">{error.message}</p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={reset}
            className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold transition-colors"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-transparent border border-zinc-800 hover:bg-zinc-900 rounded-lg font-bold transition-colors"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}
