import type { Express } from 'express';

import contextLogger from '../middleware/context-logger';
import removeHeaders from '../middleware/remove-headers';

import healthCheck from './health-check';

export function attachRoutes(app: Express): Express {
  app.use(removeHeaders);
  app.use('/health-check', healthCheck);

  app.use(contextLogger);

  app.get('/', (req, res) => {
    res.json({ test: 'This is a test' });
  });

  return app;
}
