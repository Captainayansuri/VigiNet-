/**
 * ReportService - Service abstraction for managing ground reports & offline synchronization.
 * Backed by VigiNet backend API with local persistence & offline queue fallback.
 */
import { INITIAL_REPORTS } from '../data/mockData';

const STORAGE_KEY_REPORTS = 'viginet_citizen_reports_v2';
const STORAGE_KEY_QUEUE = 'viginet_offline_queue_v2';

export const REPORT_STATUSES = {
  RECEIVED: { label: 'RECEIVED', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' },
  ANALYZING: { label: 'ANALYZING', color: 'bg-blue-950 text-blue-400 border-blue-800' },
  UNDER_REVIEW: { label: 'UNDER REVIEW', color: 'bg-amber-950 text-amber-400 border-amber-800' },
  VERIFIED: { label: 'VERIFIED', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
  ACTION_TAKEN: { label: 'ACTION TAKEN', color: 'bg-purple-950 text-purple-400 border-purple-800' },
};

class ReportService {
  getReports() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  }

  saveReports(reports) {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error('ReportService save error:', e);
    }
  }

  getOfflineQueue() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUEUE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveOfflineQueue(queue) {
    try {
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.error('ReportService queue save error:', e);
    }
  }

  generateReportId() {
    return `VN-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  createReport(reportData, isOnline = true) {
    const id = this.generateReportId();
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newReport = {
      id,
      ...reportData,
      createdAt: now.toISOString(),
      timestamp: timeString,
      date: 'Just now',
      status: 'RECEIVED',
      verificationStatus: isOnline ? 'Dispatched to Command Center' : 'Saved On Device',
      isOfflineQueued: !isOnline,
      timeline: [
        {
          status: 'RECEIVED',
          title: 'Report Submitted',
          time: timeString,
          description: isOnline
            ? 'Ground information logged and dispatched to VigiNet Control Node.'
            : 'Saved securely on device memory. Awaiting connectivity restoration.',
        },
      ],
    };

    const currentReports = this.getReports();
    const updatedReports = [newReport, ...currentReports];
    this.saveReports(updatedReports);

    if (!isOnline) {
      const currentQueue = this.getOfflineQueue();
      this.saveOfflineQueue([...currentQueue, newReport]);
    } else {
      // Async dispatch to backend
      this.dispatchReportToApi(newReport).catch((err) => {
        console.warn('[ReportService] API dispatch failed, saving to offline queue:', err.message);
        const currentQueue = this.getOfflineQueue();
        this.saveOfflineQueue([...currentQueue, newReport]);
      });
    }

    return newReport;
  }

  async dispatchReportToApi(report) {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: report.id,
          type: report.incidentType || report.type || 'GENERAL',
          title: report.incidentLabel || report.title,
          description: report.description || report.evidence?.message,
          severity: report.severity || 'MODERATE',
          latitude: report.coordinates?.lat || report.latitude,
          longitude: report.coordinates?.lng || report.longitude,
          village: report.village,
          district: report.district,
          locationText: report.locationText,
          accuracyMeters: report.accuracyMeters,
          evidence: report.evidence,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const json = await res.json();
      return json;
    } catch (error) {
      throw error;
    }
  }


  async syncQueue() {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return this.getReports();

    const reports = this.getReports();
    const nowString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const remainingQueue = [];
    const syncedIds = new Set();

    for (const queuedItem of queue) {
      try {
        await this.dispatchReportToApi(queuedItem);
        syncedIds.add(queuedItem.id);
      } catch (error) {
        console.warn(
          '[ReportService] Background sync failed for report',
          queuedItem.id,
          error.message
        );
        remainingQueue.push(queuedItem);
      }
    }

    const updatedReports = reports.map((report) => {
      if (!syncedIds.has(report.id)) return report;

      return {
        ...report,
        isOfflineQueued: false,
        verificationStatus: 'Synced with Control Node',
        timeline: [
          ...(report.timeline || []),
          {
            status: 'ANALYZING',
            title: 'Auto-Synced to VigiNet',
            time: nowString,
            description: 'Ground packet uploaded successfully after connectivity restoration.',
          },
        ],
      };
    });

    this.saveReports(updatedReports);
    this.saveOfflineQueue(remainingQueue);

    return updatedReports;
  }

}

export default new ReportService();
