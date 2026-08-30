import * as reportService from '../services/reportService.js';

export const createReport = async (req, res, next) => {
  try {
    const actorId = req.user?.id || null;
    const result = await reportService.createReport(req.body, actorId);
    res.status(201).json({
      data: result.report,
      correlation: result.correlation,
      message: 'Report received, persisted, and evaluated for incident correlation.',
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const { incidentId, citizenId, status } = req.query;
    const data = await reportService.getReports({ incidentId, citizenId, status });
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: `Report ${req.params.id} not found.` });
    }
    res.json({ data: report });
  } catch (error) {
    next(error);
  }
};
