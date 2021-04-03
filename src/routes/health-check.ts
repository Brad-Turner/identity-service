import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // const dbStatus = Mongo.healthCheck();

  const healthcheck = {
    uptime: process.uptime(),
    message: 'Healthy',
    timestamp: Date.now()
  };

  try {
    res.send(healthcheck);
  } catch (err) {
    healthcheck.message = err;
    res.status(503).send();
  }
});

export default router;
