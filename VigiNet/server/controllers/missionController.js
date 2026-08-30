import * as missionService from '../services/missionService.js';

export const getMissions = async (req, res, next) => {
  try {
    const data = await missionService.getAllMissions();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const getMissionById = async (req, res, next) => {
  try {
    const mission = await missionService.getMissionById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: `Mission ${req.params.id} not found.` });
    }
    res.json({ data: mission });
  } catch (error) {
    next(error);
  }
};

export const createMission = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const mission = await missionService.createMission(req.body, actorId);
    res.status(201).json({ data: mission });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = await missionService.updateMissionStatus(req.params.id, status, actorId);
    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const addFieldUpdate = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const update = await missionService.addFieldUpdate(req.params.id, req.body, actorId);
    res.status(201).json({ data: update });
  } catch (error) {
    next(error);
  }
};
