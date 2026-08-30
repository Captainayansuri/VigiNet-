/**
 * TimeService - Real-time clock and relative timestamp formatting.
 * Uses device/browser clock. Updates via setInterval.
 */
class TimeService {
  /**
   * Get a 24-hour formatted time string: "21:03:08"
   */
  getFormattedTime24(date = new Date()) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  /**
   * Get a short 24-hour time: "21:03"
   */
  getShortTime24(date = new Date()) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Get timezone abbreviation: "IST", "EST", etc.
   */
  getTimezoneAbbr(date = new Date()) {
    const parts = Intl.DateTimeFormat('en', { timeZoneName: 'short' }).formatToParts(date);
    const tz = parts.find(p => p.type === 'timeZoneName');
    return tz ? tz.value : '';
  }

  /**
   * Get an ISO timestamp for the current instant (for data storage).
   */
  nowISO() {
    return new Date().toISOString();
  }

  /**
   * Format an ISO timestamp or Date into a human-readable relative time string.
   * "Just now", "2 mins ago", "15 mins ago", "1 hour ago", "3 hours ago",
   * "Yesterday", "29 Aug, 18:30"
   */
  formatRelativeTime(isoOrDate) {
    if (!isoOrDate) return '';
    const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 30) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin === 1) return '1 min ago';
    if (diffMin < 60) return `${diffMin} mins ago`;
    if (diffHr === 1) return '1 hour ago';
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDay === 1) return 'Yesterday';

    // Older than 1 day: show date + time
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const time = this.getShortTime24(date);
    return `${day} ${month}, ${time}`;
  }

  /**
   * Format an ISO timestamp into short HH:MM for timeline display.
   */
  formatTimeOnly(isoOrDate) {
    if (!isoOrDate) return '';
    const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    return this.getShortTime24(date);
  }
}

export default new TimeService();
