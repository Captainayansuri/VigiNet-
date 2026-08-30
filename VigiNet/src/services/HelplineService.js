/**
 * HelplineService - Configurable emergency helpline directory service.
 */
import { EMERGENCY_CONTACTS } from '../data/mockData';

class HelplineService {
  getContacts(location = null) {
    // In future backend integration, fetch regional helplines based on location/coordinates
    return EMERGENCY_CONTACTS;
  }
}

export default new HelplineService();
