import React from 'react';
import { Truck } from 'lucide-react';

const statusStyle = {
  AVAILABLE: 'bg-emerald-400 shadow-emerald-400/60',
  DEPLOYED: 'bg-cyan-400 shadow-cyan-400/60',
  'EN ROUTE': 'bg-amber-400 shadow-amber-400/60',
  OFFLINE: 'bg-slate-600'
};

export default function TeamMarker({ node, selected, onSelect }) {
  const ring = statusStyle[node.status] || 'bg-slate-600';
  return (
    <button
      type="button"
      onClick={() => onSelect({ kind: 'team', id: node.id })}
      className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ left: node.x, top: node.y, zIndex: selected ? 30 : 15 }}
      aria-label={`Team ${node.name}`}
    >
      <span className="relative flex flex-col items-center">
        <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-slate-950 bg-blue-500/90">
          <Truck className="h-3.5 w-3.5 text-white" />
        </span>
        <span className="mt-1 whitespace-nowrap rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-blue-300">
          {node.name}
        </span>
      </span>
      <span className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-slate-950 ${ring}`} />
      {selected && (
        <span className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-300/80" />
      )}
    </button>
  );
}
