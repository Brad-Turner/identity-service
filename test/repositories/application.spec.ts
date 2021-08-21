import { v4 as uuid } from 'uuid';

import DB from '../../src/db';
import { TenantId } from '../../src/types';
import EnvironmentHandler from '../../src/environment-handler';
import { ApplicationRepository } from '../../src/repositories/application';

const TEST_TENANT = `test-tenant`;

async function cleanTestData(tenantId: string) {
  await DB.pool?.query(`DROP SCHEMA ${tenantId} CASCADE;`);
  await DB.pool?.query(`DELETE FROM tenants WHERE name = $1;`, [TEST_TENANT]);
}

async function prepareTestData(): Promise<TenantId> {
  const query = 'INSERT INTO tenants(name, domain) VALUES ($1, $2) RETURNING id';
  const response = await DB.pool?.query(query, [TEST_TENANT, uuid()]);

  if (!response) throw new Error('Error preparing test data.');

  return `"${response.rows[0].id}"`;
}

describe('Application Repository', () => {
  let tenantId: TenantId;

  beforeAll(async () => {
    const { environment } = new EnvironmentHandler();

    DB.connect({ ...environment.postgres, ssl: false });

    tenantId = await prepareTestData();
  });

  afterAll(async () => {
    await cleanTestData(tenantId);
    await DB.disconnect();
  });

  test('should create an application', async () => {
    const options = {
      name: 'Test Application',
      redirectUri: 'http://localhost/redirect',
      isPublic: false
    };

    // Create new application
    const app = await ApplicationRepository.create(options, { tenantId });

    if (!app) {
      fail('Application should be created. Received: undefined.');
    }

    expect(app.id).toBeTruthy();
    expect(app.name).toBe(options.name);
    expect(app.redirectUri).toBe(options.redirectUri);
    expect(app.isPublic).toBe(options.isPublic);
  });
});
