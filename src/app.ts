import express, { Express } from 'express';
import Logger from 'pino';

import DB from './db';
import EnvironmentHandler from './environment-handler';
import { attachRoutes } from './routes';
import { setupSecurity } from './security';

const logger = Logger();

export async function setupApp(): Promise<Express> {
  const { postgres } = new EnvironmentHandler().environment;
  DB.connect(postgres); // Initialises pooling

  const app = express();

  app.use(express.json({ limit: '1kb', strict: true }));

  setupSecurity(app);
  attachRoutes(app);

  async function handleSignal(event: NodeJS.Signals) {
    logger.warn(`Received signal ${event}. Starting to teardown connections.`);
    await DB.disconnect();
    logger.info('Successfully terminated all connections.');
  }

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);
  process.on('uncaughtException', handleSignal);

  return app;
}
