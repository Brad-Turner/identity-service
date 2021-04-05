import express, { Express } from 'express';
import Logger from 'pino';

import DB from './db';
import EnvironmentHandler from './environment-handler';
import { attachRoutes } from './routes';

const logger = Logger();
const DEFAULT_DATABASE_URL = 'postgresql://127.0.0.1:5432';

export async function setupApp(): Promise<Express> {
  const { postgres } = new EnvironmentHandler().environment;
  DB.connect(postgres); // Initialises pooling

  const app = attachRoutes(express());

  async function handleSignal(event: NodeJS.Signals) {
    logger.warn(`Received signal ${event}. Starting to teardown connections.`);
    await DB.disconnect();
    logger.info('Successfully terminated all connections.');
  }

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  return app;
}
