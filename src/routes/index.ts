import express, { Express } from 'express';
import { initialiseLogging, handleErrors, removeHeaders, validateTenantDomain } from '../middleware';

import healthCheck from './health-check';

import tenantRouter from './v1';

export function attachRoutes(app: Express): Express {
  app.use(express.json());
  app.use(removeHeaders());

  app.use('/health', healthCheck);
  app.use(initialiseLogging());

  app.get('/', (req, res) => {
    res.json({ test: 'This is a test' });
  });

  app.use('/:tenantDomain/api/v1', validateTenantDomain, tenantRouter);

  app.use(handleErrors());

  return app;
}
