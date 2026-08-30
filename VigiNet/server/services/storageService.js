import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';
import { prisma, checkDatabaseConnection } from '../config/prisma.js';
import { logAuditEvent } from './auditService.js';

const ensureDirectory = () => {
  if (config.storageProvider !== 'local') return;
  const dir = path.resolve(config.localStorageDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const saveMediaMetadata = async ({
  reportId = null,
  incidentId = null,
  filename,
  mimeType = 'image/jpeg',
  sizeBytes = 0,
  type = 'PHOTO',
  latitude = null,
  longitude = null,
  actorId = null,
}) => {
  const localDir = ensureDirectory();
  const safeFilename = filename || `evidence-${Date.now()}`;
  const storageKey = `local-storage/${reportId || 'general'}/${Date.now()}-${safeFilename}`;

  const recordPayload = {
    reportId,
    incidentId,
    type: String(type).toUpperCase() === 'VIDEO' ? 'VIDEO' : String(type).toUpperCase() === 'AUDIO' ? 'AUDIO' : 'PHOTO',
    storageKey,
    mimeType,
    sizeBytes: Number(sizeBytes) || 0,
    locationLat: latitude ? Number(latitude) : null,
    locationLng: longitude ? Number(longitude) : null,
    metadata: {
      storageProvider: 'LOCAL_DEVELOPMENT_STORAGE',
      filename: safeFilename,
      productionReady: false,
    },
  };

  // Write local mock storage metadata file
  if (localDir) {
    try {
      const dest = path.join(localDir, `${reportId || 'ev'}-${Date.now()}.json`);
      fs.writeFileSync(dest, JSON.stringify(recordPayload, null, 2));
    } catch (e) {
      console.error('[StorageService] Error saving local metadata file:', e.message);
    }
  }

  const { isConnected } = await checkDatabaseConnection();
  if (isConnected) {
    const saved = await prisma.evidence.create({
      data: recordPayload,
    });

    await logAuditEvent({
      actorId,
      action: 'EVIDENCE_METADATA_RECORDED',
      entity: 'Evidence',
      entityId: saved.id,
      incidentId,
      reportId,
      metadata: { storageKey, mimeType, sizeBytes },
    });

    return saved;
  }

  return {
    id: `EV-${Date.now()}`,
    ...recordPayload,
    createdAt: new Date().toISOString(),
  };
};

export const getEvidenceForIncident = async (incidentId) => {
  const { isConnected } = await checkDatabaseConnection();
  if (!isConnected) return [];

  return prisma.evidence.findMany({
    where: { incidentId },
    orderBy: { createdAt: 'desc' },
  });
};
