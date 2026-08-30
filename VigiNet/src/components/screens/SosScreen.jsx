import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  LifeBuoy, 
  MapPin, 
  Users, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  PhoneCall, 
  ShieldAlert,
  WifiOff
} from 'lucide-react';

const SOS_NEEDS = [
  { id: 'trapped', label: 'PEOPLE TRAPPED', icon: '👥', desc: 'Surrounded by flood or debris' },
  { id: 'medical', label: 'MEDICAL HELP', icon: '🏥', desc: 'Injuries, illness, urgent care' },
  { id: 'evacuation', label: 'EVACUATION', icon: '🛶', desc: 'Rising water, structural threat' },
  { id: 'food_water', label: 'FOOD / WATER', icon: '🍞', desc: 'Cut off from supplies' },
  { id: 'other', label: 'OTHER EMERGENCY', icon: '🚨', desc: 'Immediate crisis' }
];

export default function SosScreen() {
  const { 
    setActiveTab, 
    submitSos, 
    locationState, 
    detectUserLocation,
    isOnline, 
    setSelectedReportId 
  } = useApp();

  const [selectedNeed, setSelectedNeed] = useState(SOS_NEEDS[0]);
  const [peopleCount, setPeopleCount] = useState(2);
  const [isImmediateDanger, setIsImmediateDanger] = useState(true);
  const [locationDetails, setLocationDetails] = useState(locationState.village || '');
  const [submittedSos, setSubmittedSos] = useState(null);

  useEffect(() => {
    detectUserLocation({ fresh: true });
  }, []);

  const handleSubmit = () => {
    const sosReport = submitSos({
      needId: selectedNeed.id,
      needLabel: selectedNeed.label,
      peopleCount: peopleCount,
      isImmediateDanger: isImmediateDanger,
      locationDetails: locationDetails || locationState.village
    });

    setSubmittedSos(sosReport);

    // Launch alert confetti effect
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ef4444', '#f59e0b', '#ffffff']
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 text-xs touch-active"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="font-mono text-xs font-bold text-red-400 flex items-center gap-1">
          <LifeBuoy className="w-4 h-4 animate-spin text-red-500" style={{ animationDuration: '4s' }} />
          EMERGENCY RESCUE REQUEST
        </span>
      </div>

      {/* Confirmation Screen after SOS sent */}
      {submittedSos ? (
        <div className="space-y-4 text-center py-4 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-2xl glow-red pulse-emergency">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white font-heading tracking-wide">
              🚨 RESCUE REQUEST SENT
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
              Your location and emergency status have been broadcast with HIGH PRIORITY to local rescue teams.
            </p>
          </div>

          {/* SOS Ticket Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/40 max-w-xs mx-auto text-left space-y-2.5 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono text-slate-400">SOS TICKET ID</span>
              <span className="text-base font-mono font-black text-red-400">{submittedSos.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400">NEED TYPE</span>
              <span className="text-xs font-bold text-slate-100">{selectedNeed.label}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400">VICTIMS</span>
              <span className="text-xs font-mono font-bold text-amber-400">{peopleCount} Person(s)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-400">LOCATION</span>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[140px]">{locationDetails}</span>
            </div>
          </div>

          {/* Direct Emergency Call Button */}
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 max-w-xs mx-auto space-y-2">
            <p className="text-[11px] text-red-200">
              Need immediate phone contact with rescue dispatch?
            </p>
            <a
              href="tel:112"
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg touch-active"
            >
              <PhoneCall className="w-4 h-4" />
              <span>CALL DISASTER HELPLINE 112</span>
            </a>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedReportId(submittedSos.id);
                setActiveTab('my_reports');
              }}
              className="w-full max-w-xs py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs shadow-lg touch-active"
            >
              TRACK SOS RESCUE STATUS
            </button>
          </div>
        </div>
      ) : (
        /* SOS Form Flow */
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 shadow-md">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            <span>Use this only if you or your group are in direct danger and require emergency response.</span>
          </div>

          {/* 1. WHAT DO YOU NEED? */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase font-heading text-slate-200 tracking-wider">
              1. WHAT DO YOU NEED?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SOS_NEEDS.map((need) => {
                const isSelected = selectedNeed.id === need.id;
                return (
                  <button
                    key={need.id}
                    type="button"
                    onClick={() => setSelectedNeed(need)}
                    className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all touch-active ${
                      isSelected
                        ? 'bg-red-950/90 border-red-500 text-white ring-2 ring-red-500/40 glow-red'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{need.icon}</span>
                      <div>
                        <h4 className="text-xs font-black font-heading text-white">{need.label}</h4>
                        <p className="text-[10px] text-slate-400">{need.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-red-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. NUMBER OF PEOPLE NEEDING HELP */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>People Needing Help</span>
              </label>
              <span className="font-mono text-base font-extrabold text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-lg border border-amber-500/30">
                {peopleCount} {peopleCount === 1 ? 'Person' : 'People'}
              </span>
            </div>

            {/* Quick count buttons */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[1, 2, 3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPeopleCount(num)}
                  className={`py-2 rounded-lg font-mono text-xs font-bold transition-all touch-active ${
                    peopleCount === num 
                      ? 'bg-amber-500 text-slate-950 font-black glow-amber' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {num}{num === 10 ? '+' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* 3. IMMEDIATE DANGER TOGGLE */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Immediate Life Threat?</h4>
              <p className="text-[10px] text-slate-400">Rising water inside home, injuries, hypothermia</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setIsImmediateDanger(true)}
                className={`px-3 py-1 rounded-md text-xs font-bold ${
                  isImmediateDanger ? 'bg-red-600 text-white shadow-md' : 'text-slate-400'
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setIsImmediateDanger(false)}
                className={`px-3 py-1 rounded-md text-xs font-bold ${
                  !isImmediateDanger ? 'bg-slate-700 text-slate-200' : 'text-slate-400'
                }`}
              >
                NO
              </button>
            </div>
          </div>

          {/* 4. LOCATION CONFIRMATION */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location Details</span>
            </label>
            <input
              type="text"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="e.g. Village B, House No 42 near Water Tank"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {!isOnline && (
            <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>Offline Mode: SOS will be saved on device and auto-dispatched the second connection returns.</span>
            </div>
          )}

          {/* 5. SEND SOS BUTTON */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-2xl glow-red pulse-emergency touch-active border border-red-400/50"
          >
            <LifeBuoy className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>SEND EMERGENCY REQUEST</span>
          </button>
        </div>
      )}
    </div>
  );
}
