import { checkDatabaseConnection, prisma } from '../config/prisma.js';

export const healthCheck = async (req, res) => {
  const { isConnected, error } = await checkDatabaseConnection(1000);

  res.json({
    api: 'ok',
    database: isConnected ? 'ok' : 'unavailable',
    databaseDetails: isConnected ? 'Connected to PostgreSQL' : (error || 'Database unavailable / offline mode'),
    timestamp: new Date().toISOString(),
  });
};

export const getTeams = async (req, res, next) => {
  try {
    const { isConnected } = await checkDatabaseConnection();
    if (!isConnected) {
      return res.json({
        data: [
          { id: 'ALPHA', name: 'TEAM ALPHA', status: 'AVAILABLE', assignment: 'North District staging' },
          { id: 'BETA', name: 'TEAM BETA', status: 'DEPLOYED', assignment: 'East Basin flood response' },
          { id: 'GAMMA', name: 'TEAM GAMMA', status: 'EN ROUTE', assignment: 'Village B verification' },
          { id: 'DELTA', name: 'TEAM DELTA', status: 'OFFLINE', assignment: 'No current telemetry' },
        ],
      });
    }

    const teams = await prisma.team.findMany({
      include: {
        members: true,
      },
    });

    res.json({
      data: teams.map((t) => ({
        id: t.id,
        name: t.teamName,
        status: t.status,
        assignment: t.currentAssignment,
        capabilities: t.capabilities,
        members: t.members?.length || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const { isConnected } = await checkDatabaseConnection();
    if (!isConnected) {
      return res.json({
        data: [
          { id: 'ALT-001', title: 'FLASH FLOOD WARNING', area: 'East Basin', priority: 'CRITICAL', message: 'Response required.', incidentId: 'VN-63476' },
          { id: 'ALT-002', title: 'HEAVY RAINFALL', area: 'North District', priority: 'ELEVATED', message: 'Monitor low-lying areas.', incidentId: null },
        ],
      });
    }

    const alerts = await prisma.alert.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: alerts });
  } catch (error) {
    next(error);
  }
};

export const getShelters = async (req, res, next) => {
  try {
    const { isConnected } = await checkDatabaseConnection();
    if (!isConnected) {
      return res.json({
        data: [
          { id: 'S-1', name: 'Community Hall', latitude: 13.085, longitude: 80.275, capacity: 120, status: 'OPEN' },
        ],
      });
    }

    const shelters = await prisma.shelter.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({ data: shelters });
  } catch (error) {
    next(error);
  }
};

export const getHazards = async (req, res, next) => {
  try {
    const { isConnected } = await checkDatabaseConnection();
    if (!isConnected) {
      return res.json({
        data: [
          { id: 'HZ-1', label: 'FLOOD ZONE', type: 'flood', x: '58%', y: '49%', size: '30%' },
          { id: 'HZ-2', label: 'ROAD BLOCKAGE', type: 'road', x: '29%', y: '41%', size: '15%' },
        ],
      });
    }

    const hazards = await prisma.hazard.findMany();
    res.json({ data: hazards });
  } catch (error) {
    next(error);
  }
};

export const getSensors = async (req, res, next) => {
  try {
    const { isConnected } = await checkDatabaseConnection();
    if (!isConnected) {
      return res.json({
        data: [
          { id: 'SNS-1', type: 'water_level', name: 'North Basin Sensor', latitude: 13.081, longitude: 80.272, reading: '1.4m', unit: 'm', isSimulated: true },
        ],
      });
    }

    const sensors = await prisma.sensor.findMany();
    res.json({ data: sensors });
  } catch (error) {
    next(error);
  }
};
