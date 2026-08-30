/**
 * LocationService is a browser-only boundary for one-shot, user-initiated
 * geolocation. Area names intentionally need a future backend/geocoder.
 */
class LocationService {
  getCurrentLocation({ fresh = false } = {}) {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(this.error('UNSUPPORTED'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          success: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyMeters: Math.round(position.coords.accuracy),
          timestamp: position.timestamp
        }),
        (error) => resolve(this.error(
          error.code === error.PERMISSION_DENIED ? 'PERMISSION_DENIED'
            : error.code === error.TIMEOUT ? 'TIMEOUT' : 'POSITION_UNAVAILABLE'
        )),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: fresh ? 0 : 60000 }
      );
    });
  }

  error(errorType) {
    const message = errorType === 'PERMISSION_DENIED'
      ? 'VigiNet needs your location to attach your report to the correct area.'
      : errorType === 'UNSUPPORTED'
        ? 'Location is not supported by this browser.'
        : "We couldn't determine your current location.";
    return { success: false, errorType, message };
  }
}

export default new LocationService();
