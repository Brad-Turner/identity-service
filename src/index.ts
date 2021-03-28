import Logger from 'pino';
import { setupApp } from './app';

const PORT = process.env.PORT ?? 8080;

// TODO: Add options for clustering here...

async function main() {
  const logger = Logger();

  try {
    const app = await setupApp();

    const server = app.listen(PORT, () => {
      logger.info(`Server listening at http://localhost:${PORT}`);
    });

    const cleanup = () => server.close();

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (err) {
    logger.fatal(err);
  }
}

main();
