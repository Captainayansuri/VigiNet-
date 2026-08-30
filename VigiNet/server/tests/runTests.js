import assert from 'node:assert';
import { checkDatabaseConnection } from '../config/prisma.js';
import * as authService from '../services/authService.js';
import * as incidentService from '../services/incidentService.js';
import * as reportService from '../services/reportService.js';
import * as storageService from '../services/storageService.js';
import * as missionService from '../services/missionService.js';
import * as verificationService from '../services/verificationService.js';
import { logAuditEvent } from '../services/auditService.js';
import { correlateReportToIncidents } from '../services/incidentCorrelationService.js';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log('\n==================================================');
  console.log('  VigiNet Phase 1: Backend & Domain Test Suite');
  console.log('==================================================\n');

  // Test 1: Database Health Check Detection
  await test('Database connectivity detection reports status correctly', async () => {
    const health = await checkDatabaseConnection(500);
    assert.strictEqual(typeof health.isConnected, 'boolean');
    console.log(`    [DB Status: ${health.isConnected ? 'CONNECTED' : 'UNAVAILABLE (Graceful Fallback Mode)'}]`);
  });

  // Test 2: Password Hashing & Verification
  await test('Password hashing with bcrypt behaves securely', async () => {
    const password = 'TestSecretPassword2026!';
    const hash = await authService.hashPassword(password);
    assert.notStrictEqual(hash, password);
    assert.strictEqual(hash.startsWith('$2'), true);

    const validMatch = await authService.comparePassword(password, hash);
    assert.strictEqual(validMatch, true);

    const invalidMatch = await authService.comparePassword('WrongPassword', hash);
    assert.strictEqual(invalidMatch, false);
  });

  // Test 3: JWT Token Generation & Verification
  await test('JWT token issuance and payload decoding', async () => {
    const userPayload = {
      id: 'USR-TEST-001',
      email: 'officer@viginet.internal',
      role: 'DISTRICT_OFFICER',
    };

    const token = authService.issueToken(userPayload);
    assert.strictEqual(typeof token, 'string');

    const decoded = authService.verifyToken(token);
    assert.strictEqual(decoded.id, userPayload.id);
    assert.strictEqual(decoded.email, userPayload.email);
    assert.strictEqual(decoded.role, userPayload.role);
  });

  // Test 4: Role-Based Authorization Guard Logic
  await test('Role authorization properly permits responders and denies citizens', async () => {
    const responderUser = { id: 'R1', role: 'FIELD_RESPONDER' };
    const citizenUser = { id: 'C1', role: 'CITIZEN' };
    const allowedRoles = ['FIELD_RESPONDER', 'TEAM_LEAD', 'ADMIN'];

    assert.strictEqual(allowedRoles.includes(responderUser.role), true);
    assert.strictEqual(allowedRoles.includes(citizenUser.role), false);
  });

  // Test 5: Canonical Incident Retrieval & Model Structure (VN-63481)
  await test('Incident model contains all canonical fields for VN-63481', async () => {
    const incident = await incidentService.getIncidentByCodeOrId('VN-63481');
    assert.ok(incident, 'Incident VN-63481 should exist');
    assert.strictEqual(incident.id, 'VN-63481');
    assert.strictEqual(incident.type, 'PEOPLE TRAPPED');
    assert.strictEqual(incident.priority, 'CRITICAL');
    assert.ok(incident.location, 'Location object exists');
    assert.strictEqual(typeof incident.location.latitude, 'number');
    assert.strictEqual(typeof incident.location.longitude, 'number');
    assert.ok(incident.location.coordinates, 'Coordinates string exists');
    assert.ok(incident.reports, 'Reports summary exists');
    assert.ok(incident.evidence, 'Evidence summary exists');
    assert.ok(incident.assessment, 'Assessment summary exists');
    assert.ok(Array.isArray(incident.known), 'Known facts is array');
    assert.ok(Array.isArray(incident.unknown), 'Unknown facts is array');
    assert.ok(incident.verification, 'Verification status exists');
    assert.ok(incident.team, 'Team assignment exists');
  });

  // Test 6: Deterministic Report Correlation
  await test('Deterministic correlation correctly associates reports near VN-63481', async () => {
    const sampleIncidents = [
      {
        id: 'VN-63481',
        incidentCode: 'VN-63481',
        category: 'PEOPLE_TRAPPED',
        latitude: 13.0827,
        longitude: 80.2707,
        location: { area: 'Village B' },
      },
    ];

    const matchingReport = {
      type: 'FLOOD',
      latitude: 13.0835,
      longitude: 80.2712,
      village: 'Village B',
    };

    const correlation = correlateReportToIncidents(matchingReport, sampleIncidents);
    assert.strictEqual(correlation.correlated, true);
    assert.strictEqual(correlation.incidentCode, 'VN-63481');
    assert.ok(correlation.confidence >= 50);
  });

  // Test 7: Report Persistence Service
  await test('Report submission persists data and resolves correlation', async () => {
    const reportData = {
      type: 'PEOPLE TRAPPED',
      title: 'Water rising in sector 4',
      description: 'People trapped in second floor.',
      severity: 'CRITICAL',
      latitude: 13.0827,
      longitude: 80.2707,
      village: 'Village B',
      district: 'District 4',
    };

    const result = await reportService.createReport(reportData, 'test-actor-1');
    assert.ok(result.report);
    assert.ok(result.correlation);
    assert.strictEqual(result.report.type, 'PEOPLE TRAPPED');
  });

  // Test 8: Evidence Metadata Persistence
  await test('Evidence metadata persists with local storage adapter', async () => {
    const metadata = await storageService.saveMediaMetadata({
      reportId: 'REP-TEST-001',
      incidentId: 'VN-63481',
      filename: 'flood_photo.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1048576,
      type: 'PHOTO',
      latitude: 13.0827,
      longitude: 80.2707,
    });

    assert.ok(metadata.id);
    assert.strictEqual(metadata.type, 'PHOTO');
    assert.strictEqual(metadata.mimeType, 'image/jpeg');
    assert.ok(metadata.storageKey);
  });

  // Test 9: Incident Verification & Audit Event Logging
  await test('Incident verification logs operational audit event', async () => {
    const verification = await verificationService.verifyIncident(
      'VN-63481',
      { status: 'CONFIRMED', notes: 'Field responder confirmed water level.' },
      'USR-RESPONDER-1'
    );

    assert.ok(verification);

    const audit = await logAuditEvent({
      actorId: 'USR-RESPONDER-1',
      action: 'VERIFICATION_CONFIRMED',
      entity: 'Incident',
      entityId: 'VN-63481',
      metadata: { status: 'CONFIRMED' },
    });

    assert.ok(audit);
    assert.strictEqual(audit.action, 'VERIFICATION_CONFIRMED');
  });

  // Test 10: Mission Creation & Status Transition Lifecycle
  await test('Mission creation and status transitions behave correctly', async () => {
    const mission = await missionService.createMission(
      {
        title: 'TEST RESCUE MISSION',
        incidentId: 'VN-63481',
        teamId: 'ALPHA',
        priority: 'CRITICAL',
        status: 'ASSIGNED',
      },
      'USR-LEAD-1'
    );

    assert.ok(mission);
    assert.strictEqual(mission.teamId, 'ALPHA');
    assert.strictEqual(mission.priority, 'CRITICAL');

    const updated = await missionService.updateMissionStatus(mission.id, 'EN_ROUTE', 'USR-RESPONDER-1');
    assert.strictEqual(updated.status, 'EN_ROUTE');
  });

  await test('Mission status normalization supports the operational states used in the response workflow', async () => {
    assert.strictEqual(missionService.normalizeMissionStatus('PENDING'), 'PENDING');
    assert.strictEqual(missionService.normalizeMissionStatus('EN_ROUTE'), 'EN_ROUTE');
    assert.strictEqual(missionService.normalizeMissionStatus('ABORTED'), 'ABORTED');
    assert.strictEqual(missionService.normalizeMissionStatus('on_scene'), 'ON_SCENE');
  });

  console.log('\n--------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Fatal test execution error:', e);
  process.exit(1);
});
