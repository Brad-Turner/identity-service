//

import { Pool, PoolConfig } from 'pg';

export default class DB {
  static pool: Pool | null = null;

  static connect(config?: PoolConfig) {
    DB.pool = new Pool(config);
  }

  static async disconnect(): Promise<void> {
    await DB.pool?.end();
    DB.pool = null;
  }

  static async healthCheck() {
    const response = await DB.pool?.query('SELECT NOW()');
    return {
      checkedAt: response?.rows[0].now,
      totalCount: DB.pool?.totalCount,
      idleCount: DB.pool?.idleCount,
      waitingCount: DB.pool?.waitingCount
    };
  }
}
