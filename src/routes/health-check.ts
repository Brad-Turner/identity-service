import { Router } from 'express';

import DB from '../db';

const router = Router();

function generateHealthReport(status: 'Healthy' | 'Unhealthy') {
  return {
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
}

router.get('/', async (req, res) => {
  try {
    const dbStatus = await DB.healthCheck();

    const healthReport = { ...generateHealthReport('Healthy'), dbStatus };

    res.send(healthReport);
  } catch (err) {
    res.status(503).send({ ...generateHealthReport('Unhealthy'), message: err });
  }
});

export default router;
