import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock3, Wifi } from 'lucide-react';
import useRealTimeClock from '../../../hooks/useRealTimeClock';

export default function ResponseTopBar() {
  const { time24, timezone } = useRealTimeClock();
  const navigate = useNavigate();

  return <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#080d19]/95 backdrop-blur-xl"><div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:px-6">
    <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 font-heading text-base font-black text-cyan-400">V</div><div><p className="font-heading text-sm font-extrabold tracking-[0.16em] text-white">VIGINET</p><p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">RESPONSE OPERATIONS</p></div></div>
    <div className="flex items-center gap-2 text-[10px] font-mono"><span className="hidden items-center gap-1.5 text-slate-400 sm:flex"><Clock3 className="h-3.5 w-3.5" />{time24} {timezone}</span><span className="hidden items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-950/50 px-2 py-1 text-cyan-300 md:flex"><Wifi className="h-3 w-3" /> SYSTEM ONLINE</span><span className="hidden text-slate-400 lg:inline">ROLE: <b className="text-slate-200">FIELD RESPONDER</b></span><button type="button" onClick={() => navigate('/')} className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-500/15">Citizen Portal</button><button className="relative rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-cyan-300" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-400" /></button></div>
  </div></header>;
}
