export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-zinc-400">Loading...</p>
      </div>
    </div>
  );
}
