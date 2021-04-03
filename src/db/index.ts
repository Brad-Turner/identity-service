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
}
