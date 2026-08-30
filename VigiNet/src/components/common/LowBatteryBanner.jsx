import React from 'react';
import { useApp } from '../../context/AppContext';
import { BatteryCharging, BatteryWarning } from 'lucide-react';

export default function LowBatteryBanner() {
  const { batteryState } = useApp();

  if (!batteryState.isLowBattery) return null;

  return (
    <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between shadow-md animate-fade-in">
      <div className="flex items-center gap-2">
        <BatteryWarning className="w-4 h-4 text-amber-400 animate-bounce" />
        <div>
          <span className="font-bold">🔋 LOW BATTERY ({batteryState.level}%)</span>
          <p className="text-[10px] text-amber-200/90">Consider enabling battery saver to conserve power during emergencies.</p>
        </div>
      </div>
    </div>
  );
}
