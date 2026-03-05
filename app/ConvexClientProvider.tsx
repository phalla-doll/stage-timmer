"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ConvexReactClient | null>(null);
  const errorRef = useRef<string | null>(null);
  const clientRef = useRef<ConvexReactClient | null>(null);

  useEffect(() => {
    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      
      if (!convexUrl || convexUrl === "https://placeholder-url.convex.cloud") {
        errorRef.current = "NEXT_PUBLIC_CONVEX_URL is not configured. Please set this environment variable in Vercel.";
        return;
      }

      const convexClient = new ConvexReactClient(convexUrl);
      clientRef.current = convexClient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize Convex client";
      console.error("Convex initialization error:", err);
      errorRef.current = errorMessage;
    }
  }, []);

  useEffect(() => {
    if (clientRef.current) {
      setClient(clientRef.current);
    }
    if (errorRef.current) {
      setError(errorRef.current);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
        <div className="text-center space-y-4 max-w-md p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-500">Configuration Error</h1>
          <p className="text-zinc-400">{error}</p>
          <div className="text-sm text-zinc-500 space-y-2 text-left bg-zinc-900 p-4 rounded-lg">
            <p>To fix this issue:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to Convex Dashboard → Settings → Deployment Info</li>
              <li>Copy your Convex deployment URL</li>
              <li>In Vercel, add environment variable: NEXT_PUBLIC_CONVEX_URL</li>
              <li>Redeploy your application</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400">Initializing...</p>
        </div>
      </div>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
