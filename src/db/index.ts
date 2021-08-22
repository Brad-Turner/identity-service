import Logger from 'pino';
import { Pool, PoolConfig } from 'pg';
import { HealthStatus } from '../types';

const logger = Logger({ name: 'db' });

export default class DB {
  static pool: Pool | null = null;

  static connect(config?: PoolConfig): void {
    DB.pool = new Pool({ ssl: { rejectUnauthorized: false }, ...config });
    DB.pool.on('error', (err) => {
      logger.error(err);
    });
  }

  static async disconnect(): Promise<void> {
    logger.warn('Disconnecting from DB');
    await DB.pool?.end();
    DB.pool = null;
  }

  static async healthCheck(): Promise<HealthStatus> {
    const response = await DB.pool?.query('SELECT NOW()');
    return {
      checkedAt: response?.rows[0].now,
      totalCount: DB.pool?.totalCount,
      idleCount: DB.pool?.idleCount,
      waitingCount: DB.pool?.waitingCount
    };
  }
}
