import React from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineSyncBar() {
  const { isOnline, offlineQueue, triggerSync, networkNotice } = useApp();
  return (
    <div className="relative w-full bg-[#080d19] border-b border-slate-800 text-xs px-3 py-2 flex items-center justify-between z-30 shadow-md">
      {isOnline ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold">ONLINE</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-400 font-mono text-[11px]">
          <WifiOff className="w-3.5 h-3.5" />
          <span className="font-bold">OFFLINE</span>
        </div>
      )}
      {offlineQueue.length > 0 && isOnline && (
        <button type="button" onClick={triggerSync} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 touch-active">
          <RefreshCw className="w-3 h-3" /> SYNC QUEUE ({offlineQueue.length})
        </button>
      )}
      {networkNotice && <div className="absolute top-full left-0 right-0 px-3 py-2 bg-amber-950 border border-amber-500/30 text-[11px] text-amber-100">{networkNotice}</div>}
    </div>
  );
}
