/**
 * BatteryService - Non-intrusive device battery level monitor.
 */
class BatteryService {
  async getBatteryStatus() {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return {
          supported: true,
          level: Math.round(battery.level * 100),
          isCharging: battery.charging,
          isLowBattery: battery.level < 0.20 && !battery.charging
        };
      } catch (e) {
        console.warn('Battery API error:', e);
      }
    }
    return { supported: false, level: 100, isCharging: false, isLowBattery: false };
  }
}

export default new BatteryService();
