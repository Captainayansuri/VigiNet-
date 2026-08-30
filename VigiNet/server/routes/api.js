import express from 'express';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import * as incidentController from '../controllers/incidentController.js';
import * as reportController from '../controllers/reportController.js';
import * as evidenceController from '../controllers/evidenceController.js';
import * as missionController from '../controllers/missionController.js';
import * as systemController from '../controllers/systemController.js';

const router = express.Router();

const RESPONDER_ROLES = ['FIELD_RESPONDER', 'TEAM_LEAD', 'DISTRICT_OFFICER', 'REGIONAL_OFFICER', 'ADMIN'];
const COMMAND_ROLES = ['TEAM_LEAD', 'DISTRICT_OFFICER', 'REGIONAL_OFFICER', 'ADMIN'];

// System / Health Check
router.get('/health', systemController.healthCheck);

// Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);

// Incidents API
router.get('/incidents', optionalAuth, incidentController.getIncidents);
router.get('/incidents/:id', optionalAuth, incidentController.getIncidentById);
router.post('/incidents', authenticateToken, requireRole(...RESPONDER_ROLES), incidentController.createIncident);
router.patch('/incidents/:id', authenticateToken, requireRole(...RESPONDER_ROLES), incidentController.updateIncident);
router.post('/incidents/:id/verify', authenticateToken, requireRole(...RESPONDER_ROLES), incidentController.verifyIncident);

// Reports API
router.get('/reports', optionalAuth, reportController.getReports);
router.get('/reports/:id', optionalAuth, reportController.getReportById);
router.post('/reports', optionalAuth, reportController.createReport);

// Evidence Metadata API
router.get('/evidence', optionalAuth, evidenceController.getEvidence);
router.post('/evidence', optionalAuth, evidenceController.createEvidence);

// Missions & Operations API
router.get('/missions', optionalAuth, missionController.getMissions);
router.get('/missions/:id', optionalAuth, missionController.getMissionById);
router.post('/missions', authenticateToken, requireRole(...COMMAND_ROLES), missionController.createMission);
router.patch('/missions/:id/status', authenticateToken, requireRole(...RESPONDER_ROLES), missionController.updateStatus);
router.post('/missions/:id/field-updates', authenticateToken, requireRole(...RESPONDER_ROLES), missionController.addFieldUpdate);

// Supporting Operational Datasets
router.get('/teams', optionalAuth, systemController.getTeams);
router.get('/alerts', optionalAuth, systemController.getAlerts);
router.get('/shelters', optionalAuth, systemController.getShelters);
router.get('/hazards', optionalAuth, systemController.getHazards);
router.get('/sensors', optionalAuth, systemController.getSensors);

export default router;
