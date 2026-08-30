import * as storageService from '../services/storageService.js';

export const createEvidence = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const { reportId, incidentId, filename, mimeType, sizeBytes, type, latitude, longitude } = req.body || {};

    const saved = await storageService.saveMediaMetadata({
      reportId,
      incidentId,
      filename,
      mimeType,
      sizeBytes,
      type,
      latitude,
      longitude,
      actorId,
    });

    res.status(201).json({
      data: saved,
      storageType: 'LOCAL_DEVELOPMENT_STORAGE',
      message: 'Evidence metadata persisted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getEvidence = async (req, res, next) => {
  try {
    const { incidentId } = req.query;
    const data = await storageService.getEvidenceForIncident(incidentId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
