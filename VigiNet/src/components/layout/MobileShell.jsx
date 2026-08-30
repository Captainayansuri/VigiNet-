import React from 'react';
import { useApp } from '../../context/AppContext';
import OfflineSyncBar from '../common/OfflineSyncBar';
import { Home, AlertTriangle, FileText, Shield, LifeBuoy, MapPin, Radio } from 'lucide-react';

export default function MobileShell({ children }) {
  const { activeTab, setActiveTab, deviceFrame, setDeviceFrame, locationState } = useApp();

  // Width wrapper based on simulated device frame selection
  const frameWidthClass = {
    responsive: 'w-full max-w-md mx-auto min-h-screen',
    iphone15: 'w-[393px] mx-auto min-h-[852px] my-4 rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden',
    small320: 'w-[320px] mx-auto min-h-[640px] my-4 rounded-[32px] border-[8px] border-slate-900 shadow-2xl overflow-hidden'
  }[deviceFrame] || 'w-full max-w-md mx-auto min-h-screen';

  return (
    <div className="w-full min-h-screen bg-[#04060b] flex flex-col justify-start items-center p-0 sm:py-4">
      {/* Outer Shell container */}
      <div className={`flex flex-col bg-[#070a12] text-slate-100 shadow-2xl relative overflow-hidden ${frameWidthClass}`}>
        
        {/* Offline Sync & Connectivity Header */}
        <OfflineSyncBar />

        {/* OceanOS Top Navigation Bar */}
        <header className="px-4 py-3 bg-[#0a0f1d]/90 border-b border-slate-800/80 backdrop-blur-lg flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-extrabold text-sm shadow-md">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold tracking-wider text-sm text-white">VIGINET</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-cyan-400 font-semibold">CITIZEN</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate max-w-[170px]">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{locationState.village || (locationState.lat != null ? `${locationState.lat.toFixed(4)}, ${locationState.lng.toFixed(4)}` : 'Location unavailable')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-500/15"
            >
              Citizen Portal
            </button>
            <button
              type="button"
              onClick={() => window.location.assign('/response')}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-500/50 hover:text-cyan-200"
            >
              Responder Ops
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sos')}
              className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] tracking-wide flex items-center gap-1.5 shadow-lg pulse-emergency touch-active border border-red-400/50"
            >
              <LifeBuoy className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>I NEED HELP</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 px-3 py-3 bg-grid-pattern">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Requirement 4) */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-[#0a0f1d]/95 border-t border-slate-800/90 backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-2xl">
          {/* HOME */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-active ${
              activeTab === 'home' 
                ? 'text-cyan-400 bg-cyan-500/10 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'text-cyan-400 scale-110' : ''}`} />
            <span className="text-[10px]">HOME</span>
          </button>

          {/* REPORT (Prominent Center/Standard tab) */}
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-active ${
              activeTab === 'report' 
                ? 'text-cyan-400 bg-cyan-500/10 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'report' ? 'bg-cyan-500 text-slate-950 shadow-md glow-cyan' : 'bg-slate-800/60'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">REPORT</span>
          </button>

          {/* MY REPORTS */}
          <button
            type="button"
            onClick={() => setActiveTab('my_reports')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-active ${
              activeTab === 'my_reports' 
                ? 'text-cyan-400 bg-cyan-500/10 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className={`w-5 h-5 mb-0.5 ${activeTab === 'my_reports' ? 'text-cyan-400 scale-110' : ''}`} />
            <span className="text-[10px]">REPORTS</span>
          </button>

          {/* SAFETY */}
          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-active ${
              activeTab === 'safety' 
                ? 'text-cyan-400 bg-cyan-500/10 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className={`w-5 h-5 mb-0.5 ${activeTab === 'safety' ? 'text-cyan-400 scale-110' : ''}`} />
            <span className="text-[10px]">SAFETY</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
