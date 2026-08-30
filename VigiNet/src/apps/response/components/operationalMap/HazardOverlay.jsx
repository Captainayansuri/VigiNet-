import React from 'react';
import { AlertTriangle } from 'lucide-react';

const tone = {
  flood: 'border-red-500/40 bg-red-500/10 text-red-300',
  water: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300',
  road: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  landslide: 'border-orange-500/40 bg-orange-500/10 text-orange-300'
};

export default function HazardOverlay({ zone }) {
  const t = tone[zone.type] || tone.flood;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: zone.x, top: zone.y, width: zone.size, height: zone.size, zIndex: 5 }}
    >
      <div className={`h-full w-full rounded-full border border-dashed ${t}`} />
      <div className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded bg-slate-950/70 px-1.5 py-0.5 text-[8px] font-bold ${t}`}>
        <AlertTriangle className="h-3 w-3" /> {zone.label}
      </div>
    </div>
  );
}
