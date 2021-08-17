import DB from '../db';
import { Tenant } from '../types';

export class TenantRepository {
  static async findByDomain(domain: string): Promise<Required<Tenant> | undefined> {
    const response = await DB.pool?.query<Required<Tenant>>(
      `
        SELECT * FROM public.tenants
        WHERE domain = $1;
      `,
      [domain]
    );

    if (!response) {
      throw new Error();
    }

    return response.rows.length === 0 ? undefined : response.rows[0];
  }
}
