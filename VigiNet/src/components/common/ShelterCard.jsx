import React from 'react';
import { Home, Navigation, AlertCircle, ExternalLink } from 'lucide-react';

export default function ShelterCard({ shelter, alternativeShelter }) {
  const isFull = shelter.status === 'FULL';

  return (
    <div className={`p-3.5 rounded-xl border transition-all ${
      isFull ? 'bg-red-950/30 border-red-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2.5">
          <div className={`p-2 rounded-lg ${isFull ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            <Home className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 font-heading">{shelter.name}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              📍 {shelter.location} • {shelter.distance}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
          isFull ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {shelter.status} ({shelter.capacity})
        </span>
      </div>

      {/* Recommended Alternative if Full */}
      {isFull && alternativeShelter && (
        <div className="mt-2.5 p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-[11px] text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Shelter Full. Recommended: <strong>{alternativeShelter.name}</strong> ({alternativeShelter.distance})</span>
          </div>
        </div>
      )}

      {/* Action Directions Button */}
      <div className="mt-3 pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
        <span className="text-[10px] text-slate-400 font-mono">Follow local authority directions</span>
        <a
          href={shelter.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold flex items-center gap-1 touch-active"
        >
          <Navigation className="w-3 h-3" />
          <span>GET DIRECTIONS</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
