import express, { Express } from 'express';
import Logger from 'pino';

import MongoDB from './mongodb';
import { attachRoutes } from './routes';

const logger = Logger();
const DEFAULT_MONGO_CONNECTION_STRING = 'mongodb://127.0.0.1:27071';

export async function setupApp(): Promise<Express> {
  const connectionStr = process.env.MONGODB_CONNECTION_STRING ?? DEFAULT_MONGO_CONNECTION_STRING;
  const mongo = new MongoDB(connectionStr);

  await mongo.startup();

  const app = attachRoutes(express());

  async function handleSignal(event: NodeJS.Signals) {
    logger.warn(`Received signal ${event}. Starting to teardown connections.`);

    await mongo.shutdown();
  }

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  return app;
}
