import { Router } from 'express';

import Mongo from '../mongodb';

const router = Router();

router.get('/', (req, res) => {
  const dbStatus = Mongo.healthCheck();

  const healthcheck = {
    uptime: process.uptime(),
    message: dbStatus === 'connected' ? 'Healthy' : 'Unhealthy', // TODO: find a better solution for this
    timestamp: Date.now(),
    dbStatus
  };

  try {
    res.send(healthcheck);
  } catch (err) {
    healthcheck.message = err;
    res.status(503).send();
  }
});

export default router;
