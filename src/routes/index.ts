import { Express } from 'express';
import { initialiseLogging, handleErrors, validateTenantDomain } from '../middleware';

import healthCheck from './health-check';

import tenantRouter from './v1';

export function attachRoutes(app: Express): void {
  app.use('/health', healthCheck);
  app.use(initialiseLogging());

  app.get('/', (req, res) => {
    res.json({ test: 'This is a test' });
  });

  app.use('/:tenantDomain/api/v1', validateTenantDomain, tenantRouter);

  app.use(handleErrors());
}
