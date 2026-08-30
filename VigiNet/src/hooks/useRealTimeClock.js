import { useState, useEffect, useRef } from 'react';
import TimeService from '../services/TimeService';

/**
 * useRealTimeClock - Ticks every second and provides live clock values.
 *
 * Returns:
 *   time24   — "21:03:08"
 *   timeShort — "21:03"
 *   timezone  — "IST"
 *   dateISO   — "2026-08-30T15:33:08.000Z"
 *   dateObj   — Date object (latest tick)
 */
export default function useRealTimeClock() {
  const [now, setNow] = useState(() => new Date());
  const intervalRef = useRef(null);

  useEffect(() => {
    // Immediately sync to current second boundary
    setNow(new Date());

    intervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    time24: TimeService.getFormattedTime24(now),
    timeShort: TimeService.getShortTime24(now),
    timezone: TimeService.getTimezoneAbbr(now),
    dateISO: now.toISOString(),
    dateObj: now
  };
}
