import express, { Express } from 'express';

import MongoDB from './mongodb';
import { attachRoutes } from './routes';

const DEFAULT_MONGO_CONNECTION_STRING = 'mongodb://127.0.0.1:27071';

export async function setupApp(): Promise<Express> {
  const connectionStr = process.env.MONGODB_CONNECTION_STRING ?? DEFAULT_MONGO_CONNECTION_STRING;
  const mongo = new MongoDB(connectionStr);

  await mongo.startup();

  const app = attachRoutes(express());

  async function handleSignal(event: NodeJS.Signals) {
    // TODO: remove console.log in favour for something like log4js.
    console.log(`Received signal ${event}. Starting to teardown connections.`);

    await mongo.shutdown();

    console.log('Successfully closed MongoDB connection.');
  }

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  return app;
}
