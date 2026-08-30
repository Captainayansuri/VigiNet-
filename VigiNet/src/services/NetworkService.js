/**
 * NetworkService - Real browser online/offline state with event-driven listeners
 * and connection transition notifications.
 */

const listeners = new Set();

class NetworkService {
  constructor() {
    this._isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this._prevState = this._isOnline;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this._handleChange(true));
      window.addEventListener('offline', () => this._handleChange(false));
    }
  }

  get isOnline() {
    return this._isOnline;
  }

  _handleChange(online) {
    const prev = this._isOnline;
    this._isOnline = online;

    if (prev !== online) {
      const transition = online ? 'RESTORED' : 'LOST';
      listeners.forEach(fn => fn(online, transition));
    }
  }

  /**
   * Subscribe to online/offline transitions.
   * callback(isOnline: boolean, transition: 'RESTORED' | 'LOST')
   * Returns an unsubscribe function.
   */
  onTransition(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }
}

export default new NetworkService();
