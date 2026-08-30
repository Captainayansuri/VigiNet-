import React from 'react';
import { Camera, Video, Mic } from 'lucide-react';

const icons = { PHOTO: Camera, VIDEO: Video, VOICE: Mic };

export default function EvidenceMarker({ node, selected, onSelect }) {
  const Icon = icons[node.type] || Camera;
  return (
    <button
      type="button"
      onClick={() => onSelect({ kind: 'evidence', id: node.id })}
      className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ left: node.x, top: node.y, zIndex: selected ? 30 : 12 }}
      aria-label={`${node.type} evidence`}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-950 bg-purple-500/90">
        <Icon className="h-2.5 w-2.5 text-white" />
      </span>
      {selected && (
        <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-300/80" />
      )}
    </button>
  );
}
