import React from 'react';
import { Plus, Minus, LocateFixed, RotateCcw } from 'lucide-react';

export default function MapControls({ onZoomIn, onZoomOut, onReset }) {
  const btn =
    'flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300';
  return (
    <div className="absolute bottom-4 right-4 z-40 flex flex-col gap-2">
      <button type="button" className={btn} onClick={onZoomIn} aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
      <button type="button" className={btn} onClick={onZoomOut} aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
      <button type="button" className={btn} onClick={onReset} aria-label="Locate / center operational area"><LocateFixed className="h-4 w-4" /></button>
      <button type="button" className={btn} onClick={onReset} aria-label="Reset view"><RotateCcw className="h-4 w-4" /></button>
    </div>
  );
}
