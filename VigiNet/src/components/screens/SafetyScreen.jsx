import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import useRealTimeClock from '../../hooks/useRealTimeClock';
import TimeService from '../../services/TimeService';
import ShelterCard from '../common/ShelterCard';
import ShelterService from '../../services/ShelterService';
import { 
  ShieldAlert, 
  CheckSquare, 
  PhoneCall, 
  Home, 
  CheckCircle2, 
  AlertTriangle,
  Radio
} from 'lucide-react';

export default function SafetyScreen() {
  useRealTimeClock();
  const { activeAlert, shelters, helplines } = useApp();

  const nearestAlternative = ShelterService.getNearestAvailableShelter(shelters);

  // Survival readiness checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Charge phone & power banks to 100%', done: true },
    { id: 2, text: 'Keep waterproof emergency bag ready (ID & cash)', done: true },
    { id: 3, text: 'Stock 3 days clean drinking water', done: false },
    { id: 4, text: 'Avoid crossing flooded roads or streams', done: false },
    { id: 5, text: 'Identify nearest high ground shelter', done: false }
  ]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
          DISASTER SAFETY & PRE-ALERTS
        </h2>
        <p className="text-xs text-slate-400">Actionable survival guidance & emergency directory</p>
      </div>

      {/* 1. PRIORITY 1: ACTIVE DISASTER PRE-ALERT CARD (Requirement 12 & 13) */}
      {activeAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/50 shadow-xl space-y-3 glow-amber">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> PRE-ALERT
            </span>
            <span className="text-[11px] font-mono text-amber-400 font-bold">{TimeService.formatRelativeTime(activeAlert.createdAt)}</span>
          </div>

          <h3 className="text-base font-black text-white font-heading">
            ⚠️ {activeAlert.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeAlert.description}
          </p>

          {/* 2. PRIORITY 2: WHAT TO DO NOW (Immediate Action Checklist) */}
          <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
            <span className="text-xs font-bold text-amber-300 block font-heading tracking-wide">
              ⚡ WHAT TO DO NOW:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {activeAlert.actions.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">✓</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 3. PRIORITY 3: NEAREST RESCUE SHELTERS */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase font-heading text-slate-200 tracking-wider flex items-center gap-1.5">
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Nearest High-Ground Shelters</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {shelters.map((shelter, idx) => (
            <ShelterCard 
              key={idx} 
              shelter={shelter} 
              alternativeShelter={shelter.status === 'FULL' ? nearestAlternative : null} 
            />
          ))}
        </div>
      </div>

      {/* 4. PRIORITY 4: EMERGENCY RESPONSE HELPLINES */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <h3 className="text-xs font-extrabold uppercase font-heading text-slate-200 tracking-wider flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-red-400" />
          <span>Emergency Response Helplines</span>
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {helplines.map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.number}`}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-red-500/40 flex items-center justify-between transition-all touch-active"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{contact.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{contact.name}</h4>
                  <span className="text-[11px] font-mono font-bold text-red-400">{contact.number}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-extrabold">
                CALL
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 5. PRIORITY 5: READINESS CHECKLIST */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase font-heading text-slate-200 tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <span>Disaster Readiness Checklist</span>
          </h3>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {checklist.filter(c => c.done).length}/{checklist.length} Done
          </span>
        </div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCheck(item.id)}
              className={`w-full p-2.5 rounded-xl text-left border flex items-center gap-3 transition-all touch-active ${
                item.done 
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-slate-200' 
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                item.done ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold' : 'border-slate-700'
              }`}>
                {item.done && '✓'}
              </div>
              <span className={`text-xs font-medium ${item.done ? 'line-through text-slate-300' : ''}`}>
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
