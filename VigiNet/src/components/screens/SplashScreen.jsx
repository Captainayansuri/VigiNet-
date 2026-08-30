import React, { useEffect, useState } from 'react';
import { ShieldCheck, Compass, Radio, CheckCircle2 } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [statusText, setStatusText] = useState('Initializing VigiNet Citizen Engine...');
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatusText('Pinging Local Emergency Nodes...');
      setProgress(50);
    }, 600);

    const t2 = setTimeout(() => {
      setStatusText('GPS Location & Spatial Risk Grid Loaded');
      setProgress(90);
    }, 1200);

    const t3 = setTimeout(() => {
      setProgress(100);
      onFinish();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04060b] text-white p-6 animate-fade-in">
      <div className="w-full max-w-xs text-center space-y-6">
        
        {/* Animated OceanOS Logo */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-cyan-400/50 pulse-cyan"></div>
          <div className="w-16 h-16 rounded-2xl bg-cyan-500 text-slate-950 font-black text-3xl font-heading flex items-center justify-center shadow-2xl glow-cyan">
            V
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black font-heading tracking-widest text-white">
            VIGINET
          </h1>
          <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mt-1">
            CITIZEN EMERGENCY NETWORK
          </p>
        </div>

        {/* Progress Bar & Boot Logs */}
        <div className="space-y-2 pt-4">
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 shadow-md shadow-cyan-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{statusText}</span>
          </p>
        </div>

        <div className="pt-8 text-[10px] font-mono text-slate-600">
          Avinya 2026 • Post-Disaster Information Fog Solution
        </div>
      </div>
    </div>
  );
}
