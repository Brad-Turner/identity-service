import express, { Express } from 'express';

import contextLogger from '../middleware/context-logger';
import removeHeaders from '../middleware/remove-headers';
import { validateTenantDomain } from '../middleware/validate-tenant-domain';

import healthCheck from './health-check';

import tenantRouter from './v1';

export function attachRoutes(app: Express): Express {
  app.use(express.json());
  app.use(removeHeaders);
  app.use('/health-check', healthCheck);

  app.use(contextLogger);

  app.get('/', (req, res) => {
    res.json({ test: 'This is a test' });
  });

  app.use('/api/:tenantDomain', validateTenantDomain, tenantRouter);

  return app;
}
