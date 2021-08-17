import DB from '../../src/db';
import { TenantId } from '../../src/types';

import EnvironmentHandler from '../../src/environment-handler';
import { ApplicationRepository } from '../../src/repositories/application';

describe('Application Repository', () => {
  let tenantId: TenantId;
  let repo: ApplicationRepository;

  beforeAll(async () => {
    const { environment } = new EnvironmentHandler();

    DB.connect({ ...environment.postgres, ssl: false });

    const response = await DB.pool?.query('INSERT INTO tenants(name) VALUES ($1) RETURNING id;', ['app-repo-test']);

    tenantId = `"${response?.rows[0].id}"`;
    repo = new ApplicationRepository(tenantId);
  });

  afterAll(async () => {
    await DB.pool?.query(`DROP SCHEMA ${tenantId} CASCADE;`);
    await DB.disconnect();
  });

  test('should create and get an application', async () => {
    const options = {
      name: 'Test Application',
      redirectUri: 'http://localhost/redirect',
      isPublic: false
    };

    // Create new application
    const createRes = await repo.create(options);

    expect(typeof createRes.id === 'string' && createRes.id).toBeTruthy();
    expect(createRes.name).toBe(options.name);
    expect(createRes.redirectUri).toBe(options.redirectUri);
    expect(createRes.isPublic).toBe(options.isPublic);

    // Find by id
    const findRes = await repo.getById(createRes.id);

    expect(findRes.id).toBe(createRes.id);
    expect(findRes.name).toBe(options.name);
    expect(findRes.redirectUri).toBe(options.redirectUri);
    expect(findRes.isPublic).toBe(options.isPublic);
  });
});
