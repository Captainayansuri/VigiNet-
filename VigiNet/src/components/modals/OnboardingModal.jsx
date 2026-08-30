import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, LifeBuoy, WifiOff, X, ArrowRight } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose }) {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const SLIDES = [
    {
      title: 'FAST GROUND REPORTING',
      desc: 'Submit photos, voice notes, and incident reports in under 20 seconds during emergencies.',
      icon: AlertTriangle,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    },
    {
      title: 'INSTANT SOS RESCUE',
      desc: 'If you or your group are trapped or in danger, broadcast a 1-tap SOS emergency request.',
      icon: LifeBuoy,
      color: 'text-red-400 border-red-500/40 bg-red-500/10'
    },
    {
      title: 'OFFLINE RESILIENT UX',
      desc: 'No signal? No problem. Reports are saved securely on your device and auto-synced when online.',
      icon: WifiOff,
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    }
  ];

  const current = SLIDES[slide];
  const Icon = current.icon;

  const handleNext = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(slide + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm p-5 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4 relative">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 space-y-3">
          <div className={`w-16 h-16 mx-auto rounded-2xl border flex items-center justify-center shadow-lg ${current.color}`}>
            <Icon className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            VIGINET CITIZEN APP
          </span>

          <h3 className="text-lg font-black text-white font-heading tracking-wide">
            {current.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {current.desc}
          </p>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === slide ? 'w-6 bg-cyan-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg glow-cyan touch-active"
        >
          <span>{slide === SLIDES.length - 1 ? 'GET STARTED' : 'CONTINUE'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
