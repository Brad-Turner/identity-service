import { Express } from 'express';
import healthCheck from './health-check';

export function attachRoutes(app: Express): Express {
  app.use('/health-check', healthCheck);

  app.get('/', (req, res) => {
    res.json({ test: 'This is a test' });
  });

  return app;
}
