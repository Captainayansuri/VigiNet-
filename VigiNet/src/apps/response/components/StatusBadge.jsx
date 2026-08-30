import React from 'react';

const styles = {
  CRITICAL: 'border-red-500/40 bg-red-950/70 text-red-300',
  SERIOUS: 'border-amber-500/40 bg-amber-950/70 text-amber-300',
  MODERATE: 'border-cyan-500/35 bg-cyan-950/60 text-cyan-300',
  LOW: 'border-slate-600 bg-slate-800 text-slate-300',
  RECEIVED: 'border-slate-600 bg-slate-800 text-slate-300',
  'UNDER REVIEW': 'border-amber-500/40 bg-amber-950/70 text-amber-300',
  'VERIFICATION REQUIRED': 'border-purple-500/40 bg-purple-950/60 text-purple-300',
  'FIELD TEAM ASSIGNED': 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
  'IN VERIFICATION': 'border-purple-500/40 bg-purple-950/60 text-purple-300',
  VERIFIED: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
  'RESPONSE DISPATCHED': 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
  RESOLVED: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
  ELEVATED: 'border-amber-500/40 bg-amber-950/70 text-amber-300',
  HIGH: 'border-orange-500/40 bg-orange-950/70 text-orange-300',
  MEDIUM: 'border-amber-500/40 bg-amber-950/70 text-amber-300',
  PENDING: 'border-amber-500/40 bg-amber-950/70 text-amber-300',
  DRAFT: 'border-slate-600 bg-slate-800 text-slate-300',
  ASSIGNED: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
  ACCEPTED: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
  'EN ROUTE': 'border-amber-500/40 bg-amber-950/70 text-amber-300',
  'ON SCENE': 'border-blue-500/40 bg-blue-950/60 text-blue-300',
  'IN PROGRESS': 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
  COMPLETED: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
  CANCELLED: 'border-slate-600 bg-slate-800 text-slate-400',
  ABORTED: 'border-red-500/40 bg-red-950/70 text-red-300',
  'UNABLE TO REACH': 'border-red-500/40 bg-red-950/70 text-red-300',
  EN_ROUTE: 'border-amber-500/40 bg-amber-950/70 text-amber-300',
  ON_SCENE: 'border-blue-500/40 bg-blue-950/60 text-blue-300',
  IN_PROGRESS: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
};

export default function StatusBadge({ value }) {
  const displayValue = typeof value === 'string' ? value.replace(/_/g, ' ') : value;
  const key = typeof value === 'string' ? value : displayValue;
  return <span className={`inline-flex max-w-full rounded border px-1.5 py-0.5 text-[9px] font-mono font-bold leading-tight tracking-wide ${styles[key] || styles[displayValue] || styles.LOW}`}>{displayValue}</span>;
}
