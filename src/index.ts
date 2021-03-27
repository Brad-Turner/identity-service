import { setupApp } from './app';

const PORT = process.env.PORT ?? 8080;

// TODO: Add options for clustering here...

async function main() {
  try {
    const app = await setupApp();

    const server = app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });

    const cleanup = () => server.close();

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (err) {
    console.error(err);
  }
}

main();
