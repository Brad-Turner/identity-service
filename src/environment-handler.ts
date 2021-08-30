import { PoolConfig } from 'pg';

interface Environment {
  postgres: PoolConfig;
  smtp: {
    domain: string;
    key: string;
  };
}

export default class EnvironmentHandler {
  protected _environment: Environment;

  constructor() {
    if (!process.env.DATABASE_URL) {
      const required = ['POSTGRES_PASSWORD', 'MAILGUN_DOMAIN', 'MAILGUN_KEY'];
      const missing = required.reduce<string[]>((arr, key) => {
        if (process.env[key] === undefined) arr.push(key);
        return arr;
      }, []);

      if (missing.length) throw new Error(`Missing required environment variables: ${missing}.`);
    }

    const password = process.env.POSTGRES_PASSWORD as string;
    const ssl = process.env.DB_SSL ? { rejectUnauthorized: false } : false;

    const user = process.env.POSTGRES_USER ?? 'postgres';
    const host = process.env.POSTGRES_HOST ?? 'localhost';
    const port = parseInt(process.env.POSTGRES_PORT ?? '5432');
    const database = process.env.POSTGRES_DB ?? 'postgres';
    const connectionString = process.env.DATABASE_URL ?? `postgres://${user}:${password}@${host}:${port}/${database}`;

    this._environment = {
      postgres: { user, password, database, host, port, ssl, connectionString },
      smtp: {
        domain: process.env.MAILGUN_DOMAIN as string,
        key: process.env.MAILGUN_KEY as string
      }
    };
  }

  set environment(env: Environment) {
    this._environment = env;
  }

  get environment(): Environment {
    return this._environment;
  }
}
