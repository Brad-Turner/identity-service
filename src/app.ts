import express, { Express } from 'express';
import Logger from 'pino';

import DB from './db';
import { attachRoutes } from './routes';

const logger = Logger();
const DEFAULT_DB_CONNECTION_STRING = 'postgresql://127.0.0.1:5432';

export async function setupApp(): Promise<Express> {
  const connectionString = process.env.DB_CONNECTION_STRING ?? DEFAULT_DB_CONNECTION_STRING;

  DB.connect({ connectionString }); // Initialises pooling

  const app = attachRoutes(express());

  async function handleSignal(event: NodeJS.Signals) {
    logger.warn(`Received signal ${event}. Starting to teardown connections.`);
    await DB.disconnect();
  }

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  return app;
}
