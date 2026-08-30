import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/viginet?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting VigiNet development database seed...');

  // 1. Clean existing records in reverse dependency order
  await prisma.auditEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.fieldUpdate.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.verificationRecord.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.report.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.responderProfile.deleteMany();
  await prisma.citizenProfile.deleteMany();
  await prisma.team.deleteMany();
  await prisma.shelter.deleteMany();
  await prisma.hazard.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.user.deleteMany();

  // 2. Passwords hashing
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  const passwordHashLead = await bcrypt.hash('lead123', 10);
  const passwordHashResponder = await bcrypt.hash('responder123', 10);
  const passwordHashCitizen = await bcrypt.hash('citizen123', 10);

  // 3. Create Teams
  const teamAlpha = await prisma.team.create({
    data: {
      id: 'ALPHA',
      teamName: 'TEAM ALPHA',
      status: 'AVAILABLE',
      capabilities: ['Flood rescue', 'Medical support'],
      currentAssignment: 'North District staging',
      locationLat: 13.0827,
      locationLng: 80.2707,
    },
  });

  const teamBeta = await prisma.team.create({
    data: {
      id: 'BETA',
      teamName: 'TEAM BETA',
      status: 'DEPLOYED',
      capabilities: ['Swift water', 'Evacuation'],
      currentAssignment: 'East Basin flood response',
      locationLat: 13.09,
      locationLng: 80.28,
    },
  });

  const teamGamma = await prisma.team.create({
    data: {
      id: 'GAMMA',
      teamName: 'TEAM GAMMA',
      status: 'EN ROUTE',
      capabilities: ['Verification', 'Reconnaissance'],
      currentAssignment: 'Village B verification',
      locationLat: 13.05,
      locationLng: 80.22,
    },
  });

  const teamDelta = await prisma.team.create({
    data: {
      id: 'DELTA',
      teamName: 'TEAM DELTA',
      status: 'OFFLINE',
      capabilities: ['Standby', 'Logistics'],
      currentAssignment: 'No current telemetry',
      locationLat: 13.02,
      locationLng: 80.20,
    },
  });

  // 4. Create Users
  const adminUser = await prisma.user.create({
    data: {
      id: 'USR-ADMIN-1',
      email: 'admin@viginet.internal',
      passwordHash: passwordHashAdmin,
      role: 'ADMIN',
    },
  });

  const leadUser = await prisma.user.create({
    data: {
      id: 'USR-LEAD-1',
      email: 'lead@viginet.internal',
      passwordHash: passwordHashLead,
      role: 'TEAM_LEAD',
      responderProfile: {
        create: {
          teamId: teamAlpha.id,
          fullName: 'Commander Rajesh',
          designation: 'Operations Lead',
          status: 'AVAILABLE',
        },
      },
    },
  });

  const responderUser = await prisma.user.create({
    data: {
      id: 'USR-RESPONDER-1',
      email: 'responder@viginet.internal',
      passwordHash: passwordHashResponder,
      role: 'FIELD_RESPONDER',
      responderProfile: {
        create: {
          teamId: teamAlpha.id,
          fullName: 'Vikram Singh',
          designation: 'Senior Field Responder',
          status: 'AVAILABLE',
        },
      },
    },
  });

  const citizenUser = await prisma.user.create({
    data: {
      id: 'USR-CITIZEN-1',
      email: 'citizen@viginet.internal',
      passwordHash: passwordHashCitizen,
      role: 'CITIZEN',
      citizenProfile: {
        create: {
          fullName: 'Aarav Sharma',
          village: 'Village B',
          district: 'District 4',
          preferredLang: 'en',
          locationLat: 13.0827,
          locationLng: 80.2707,
        },
      },
    },
  });

  // 5. Create Incidents
  const incidentVN63481 = await prisma.incident.create({
    data: {
      id: 'VN-63481',
      incidentCode: 'VN-63481',
      title: 'People Trapped',
      description: 'Potentially severe trapping incident. Multiple reports indicate rapidly rising water levels in low-lying residential sectors.',
      category: 'PEOPLE TRAPPED',
      severity: 'CRITICAL',
      status: 'OPEN',
      latitude: 13.0827,
      longitude: 80.2707,
      accuracy: '±14 m',
      area: 'Village B — Lower Sector',
      district: 'District 4',
      state: 'Tamil Nadu',
      affectedArea: '~0.8 km',
      radiusMeters: 800,
      locationText: 'Village B — Lower Sector, District 4, Tamil Nadu',
      confidence: '82%',
      summary: 'Multiple reports indicate a potentially severe incident. Field verification is recommended.',
      knownFacts: [
        'Multiple nearby reports',
        'Water level reportedly rising',
        'People may be trapped',
        'Road access may be restricted',
      ],
      unknownFacts: [
        'Exact number of people trapped',
        'Current water depth',
        'Safe access route',
        'Condition of affected buildings',
      ],
      reportedAt: new Date(Date.now() - 3600000),
    },
  });

  const incidentVN63476 = await prisma.incident.create({
    data: {
      id: 'VN-63476',
      incidentCode: 'VN-63476',
      title: 'Flash Flooding',
      description: 'Flooding in East Basin with rapid water accumulation across main intersections.',
      category: 'FLASH FLOODING',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      latitude: 13.09,
      longitude: 80.28,
      accuracy: '±25 m',
      area: 'East Basin',
      district: 'District 4',
      state: 'Tamil Nadu',
      affectedArea: '~1.2 km',
      radiusMeters: 1200,
      locationText: 'East Basin, District 4, Tamil Nadu',
      confidence: '76%',
      summary: 'Field team assigned.',
      reportedAt: new Date(Date.now() - 4800000),
    },
  });

  const incidentVN28491 = await prisma.incident.create({
    data: {
      id: 'VN-28491',
      incidentCode: 'VN-28491',
      title: 'Urban Flooding',
      description: 'Flooding reported across North Ridge low-lying streets.',
      category: 'FLOODING',
      severity: 'HIGH',
      status: 'OPEN',
      latitude: 13.05,
      longitude: 80.22,
      accuracy: '±30 m',
      area: 'North Ridge',
      district: 'District 2',
      state: 'Tamil Nadu',
      affectedArea: '~2.1 km',
      radiusMeters: 2100,
      locationText: 'North Ridge, District 2, Tamil Nadu',
      confidence: '64%',
      summary: 'Multiple serious reports, but source agreement is only partial.',
      knownFacts: [
        'Water level rising in low-lying streets',
        'Several vehicles stranded',
        'Local power disrupted in sector 3',
      ],
      unknownFacts: [
        'Exact depth of flooding',
        'Number of people needing rescue',
        'Structural integrity of older buildings',
      ],
      reportedAt: new Date(Date.now() - 7200000),
    },
  });

  const incidentVN28455 = await prisma.incident.create({
    data: {
      id: 'VN-28455',
      incidentCode: 'VN-28455',
      title: 'Fallen Tree',
      description: 'Tree fallen across road, cleared by locals.',
      category: 'TREE FALLEN',
      severity: 'MODERATE',
      status: 'VERIFIED',
      latitude: 13.02,
      longitude: 80.20,
      accuracy: '±20 m',
      area: 'Green Avenue',
      district: 'District 1',
      state: 'Tamil Nadu',
      affectedArea: '~0.3 km',
      radiusMeters: 300,
      locationText: 'Green Avenue, District 1, Tamil Nadu',
      confidence: '90%',
      summary: 'Verified by field responder; road cleared, no injuries.',
      knownFacts: [
        'Tree blocked road',
        'Locals cleared the road',
        'No injuries reported',
      ],
      unknownFacts: [
        'Cause of tree fall',
        'Whether adjacent trees are at risk',
      ],
      reportedAt: new Date(Date.now() - 10800000),
    },
  });

  // 6. Create Reports
  const report1 = await prisma.report.create({
    data: {
      id: 'REP-VN-63481-1',
      citizenId: citizenUser.id,
      incidentId: incidentVN63481.id,
      type: 'PEOPLE TRAPPED',
      title: 'People Trapped',
      description: 'Water has entered the lower houses and people are calling for help.',
      severity: 'CRITICAL',
      status: 'RECEIVED',
      source: 'APP',
      latitude: 13.0827,
      longitude: 80.2707,
      accuracyMeters: 14,
      village: 'Village B',
      district: 'District 4',
      locationText: 'Village B — Lower Sector',
    },
  });

  const report2 = await prisma.report.create({
    data: {
      id: 'REP-VN-63481-2',
      citizenId: citizenUser.id,
      incidentId: incidentVN63481.id,
      type: 'FLOOD',
      title: 'Flooding',
      description: 'Street is flooding near the market.',
      severity: 'HIGH',
      status: 'RECEIVED',
      source: 'APP',
      latitude: 13.0835,
      longitude: 80.2712,
      accuracyMeters: 18,
      village: 'Village B',
      district: 'District 4',
      locationText: 'Market Road',
    },
  });

  const report3 = await prisma.report.create({
    data: {
      id: 'REP-VN-63481-3',
      citizenId: citizenUser.id,
      incidentId: incidentVN63481.id,
      type: 'ROAD_BLOCK',
      title: 'Road Blocked',
      description: 'Road blocked by debris and rising water.',
      severity: 'HIGH',
      status: 'RECEIVED',
      source: 'APP',
      latitude: 13.084,
      longitude: 80.2718,
      accuracyMeters: 22,
      village: 'Village B',
      district: 'District 4',
      locationText: 'Access Bridge',
    },
  });

  // 7. Create Evidence
  await prisma.evidence.createMany({
    data: [
      {
        id: 'EV-63481-1',
        reportId: report1.id,
        incidentId: incidentVN63481.id,
        type: 'PHOTO',
        storageKey: 'reports/REP-VN-63481-1/flood-water.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1048576,
        locationLat: 13.0827,
        locationLng: 80.2707,
        metadata: { source: 'Citizen Upload', locationName: 'Village B' },
      },
      {
        id: 'EV-63481-2',
        reportId: report2.id,
        incidentId: incidentVN63481.id,
        type: 'PHOTO',
        storageKey: 'reports/REP-VN-63481-2/lower-sector.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 2048576,
        locationLat: 13.0835,
        locationLng: 80.2712,
        metadata: { source: 'Citizen Upload', locationName: 'Lower Sector' },
      },
      {
        id: 'EV-63481-3',
        reportId: report3.id,
        incidentId: incidentVN63481.id,
        type: 'VIDEO',
        storageKey: 'reports/REP-VN-63481-3/main-road.mp4',
        mimeType: 'video/mp4',
        sizeBytes: 5242880,
        locationLat: 13.084,
        locationLng: 80.2718,
        metadata: { source: 'Citizen Upload', locationName: 'Main Road' },
      },
      {
        id: 'EV-63481-4',
        reportId: report1.id,
        incidentId: incidentVN63481.id,
        type: 'AUDIO',
        storageKey: 'reports/REP-VN-63481-1/voice-note.aac',
        mimeType: 'audio/aac',
        sizeBytes: 256000,
        locationLat: 13.0827,
        locationLng: 80.2707,
        metadata: { source: 'Citizen Upload', locationName: 'Village B' },
      },
    ],
  });

  // 8. Create Verification Record
  await prisma.verificationRecord.create({
    data: {
      id: 'VR-63481-1',
      reportId: report1.id,
      incidentId: incidentVN63481.id,
      responderId: responderUser.id,
      status: 'CONFIRMED',
      notes: 'Initial correlation verified with multiple corroborating citizen reports.',
    },
  });

  // 9. Create Missions
  await prisma.mission.create({
    data: {
      id: 'VN-M001',
      incidentId: incidentVN63481.id,
      teamId: teamAlpha.id,
      title: 'FLOOD RESCUE — VILLAGE B',
      objective: 'Reach Village B Lower Sector and verify/rescue trapped civilians.',
      status: 'EN_ROUTE',
      priority: 'CRITICAL',
      location: 'Village B — Lower Sector',
      etaMinutes: 12,
      hazards: ['Flooded roads', 'Fast-moving water', 'Potential electrical hazard'],
      lat: 13.0827,
      lon: 80.2707,
      accuracy: '±14 m',
    },
  });

  await prisma.mission.create({
    data: {
      id: 'VN-M002',
      incidentId: incidentVN63476.id,
      teamId: teamBeta.id,
      title: 'EAST BASIN FLOOD RESPONSE',
      objective: 'Assess East Basin flooding and support evacuation of low-lying sectors.',
      status: 'ON_SCENE',
      priority: 'HIGH',
      priorityOverridden: true,
      location: 'East Basin',
      etaMinutes: 0,
      hazards: ['Flooded roads', 'Structural risk'],
      lat: 13.09,
      lon: 80.28,
      accuracy: '±25 m',
    },
  });

  await prisma.mission.create({
    data: {
      id: 'VN-M003',
      incidentId: incidentVN28491.id,
      teamId: teamGamma.id,
      title: 'NORTH RIDGE VERIFICATION',
      objective: 'Verify flooding reports in North Ridge and report field conditions.',
      status: 'ASSIGNED',
      priority: 'MODERATE',
      location: 'North Ridge',
      etaMinutes: 18,
      hazards: ['Rising water'],
      lat: 13.05,
      lon: 80.22,
      accuracy: '±30 m',
    },
  });

  await prisma.mission.create({
    data: {
      id: 'VN-M004',
      incidentId: incidentVN28455.id,
      teamId: teamAlpha.id,
      title: 'GREEN AVENUE CLEARANCE',
      objective: 'Clear fallen tree and confirm road safe for traffic.',
      status: 'COMPLETED',
      priority: 'LOW',
      location: 'Green Avenue',
      hazards: ['Debris'],
      lat: 13.02,
      lon: 80.20,
      accuracy: '±20 m',
    },
  });

  // 10. Create Alerts, Shelters, Hazards, Sensors
  await prisma.alert.createMany({
    data: [
      {
        id: 'ALT-001',
        incidentId: incidentVN63476.id,
        title: 'FLASH FLOOD WARNING',
        description: 'Response required across East Basin low-lying sectors.',
        severity: 'CRITICAL',
        sourceType: 'SIMULATED',
        sourceName: 'Command Center',
        latitude: 13.09,
        longitude: 80.28,
        isActive: true,
      },
      {
        id: 'ALT-002',
        title: 'HEAVY RAINFALL',
        description: 'Monitor low-lying areas in North District.',
        severity: 'HIGH',
        sourceType: 'WEATHER',
        sourceName: 'Regional Met Dept',
        latitude: 13.05,
        longitude: 80.22,
        isActive: true,
      },
    ],
  });

  await prisma.shelter.createMany({
    data: [
      {
        id: 'S-1',
        name: 'Community Hall',
        latitude: 13.085,
        longitude: 80.275,
        capacity: 120,
        status: 'OPEN',
        address: 'Sector 4, Main Hall Road',
      },
      {
        id: 'S-2',
        name: 'Govt Higher Secondary School',
        latitude: 13.06,
        longitude: 80.24,
        capacity: 250,
        status: 'OPEN',
        address: 'School Road, District 2',
      },
    ],
  });

  await prisma.hazard.createMany({
    data: [
      { id: 'HZ-1', name: 'FLOOD ZONE', type: 'flood', severity: 'CRITICAL', latitude: 13.083, longitude: 80.271, radiusMeters: 500, x: '58%', y: '49%', size: '30%' },
      { id: 'HZ-2', name: 'ROAD BLOCKAGE', type: 'road', severity: 'HIGH', latitude: 13.084, longitude: 80.272, radiusMeters: 200, x: '29%', y: '41%', size: '15%' },
      { id: 'HZ-3', name: 'LANDSLIDE RISK', type: 'landslide', severity: 'HIGH', latitude: 13.052, longitude: 80.223, radiusMeters: 400, x: '45%', y: '73%', size: '18%' },
      { id: 'HZ-4', name: 'HIGH WATER', type: 'water', severity: 'CRITICAL', latitude: 13.091, longitude: 80.282, radiusMeters: 600, x: '70%', y: '27%', size: '20%' },
    ],
  });

  await prisma.sensor.createMany({
    data: [
      { id: 'SNS-1', name: 'North Basin Sensor', type: 'water_level', latitude: 13.081, longitude: 80.272, reading: '1.4m', unit: 'm', isSimulated: true },
      { id: 'SNS-2', name: 'Bridge Flow Telemetry', type: 'flow_rate', latitude: 13.084, longitude: 80.271, reading: '3.8 m/s', unit: 'm/s', isSimulated: true },
    ],
  });

  // 11. Create Audit Events
  await prisma.auditEvent.createMany({
    data: [
      {
        id: 'AUD-1',
        actorId: adminUser.id,
        action: 'INCIDENT_CREATED',
        entity: 'Incident',
        entityId: incidentVN63481.id,
        incidentId: incidentVN63481.id,
        metadata: { reason: 'Initial seed' },
      },
      {
        id: 'AUD-2',
        actorId: leadUser.id,
        action: 'MISSION_CREATED',
        entity: 'Mission',
        entityId: 'VN-M001',
        incidentId: incidentVN63481.id,
        metadata: { teamId: teamAlpha.id },
      },
    ],
  });

  console.log('✅ VigiNet development database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
