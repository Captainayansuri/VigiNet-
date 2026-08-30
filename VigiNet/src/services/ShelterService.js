/**
 * ShelterService - High-ground rescue shelters provider & capacity manager.
 */
import { RESCUE_SHELTERS } from '../data/mockData';

class ShelterService {
  getShelters() {
    return RESCUE_SHELTERS.map(shelter => ({
      ...shelter,
      directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.name + ' ' + shelter.location)}`
    }));
  }

  getNearestAvailableShelter(currentShelters) {
    return currentShelters.find(s => s.status === 'OPEN') || null;
  }
}

export default new ShelterService();
