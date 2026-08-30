import * as incidentService from '../services/incidentService.js';
import * as verificationService from '../services/verificationService.js';

export const getIncidents = async (req, res, next) => {
  try {
    const data = await incidentService.getAllIncidents();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await incidentService.getIncidentByCodeOrId(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found.` });
    }
    res.json({ data: incident });
  } catch (error) {
    next(error);
  }
};

export const createIncident = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const incident = await incidentService.createIncident(req.body, actorId);
    res.status(201).json({ data: incident });
  } catch (error) {
    next(error);
  }
};

export const updateIncident = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const updated = await incidentService.updateIncident(req.params.id, req.body, actorId);
    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const verifyIncident = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const record = await verificationService.verifyIncident(req.params.id, req.body, actorId);
    res.json({ data: record, message: 'Incident verification recorded.' });
  } catch (error) {
    next(error);
  }
};
