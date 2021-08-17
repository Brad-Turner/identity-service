import DB from '../db';
import { Application, QueryOptions } from '../types';

export class ApplicationRepository {
  static async create(application: Application, options: QueryOptions): Promise<Required<Application> | undefined> {
    const response = await DB.pool?.query<Required<Application>>(
      `
      INSERT INTO ${options.tenantId}.applications (name, redirect_uri, is_public)
      VALUES ($1, $2, $3)
      RETURNING id, name, redirect_uri as "redirectUri", is_public as "isPublic";
      `,
      [application.name, application.redirectUri, application.isPublic]
    );

    if (!response) {
      throw new Error();
    }

    return response.rows.length === 0 ? undefined : response.rows[0];
  }

  static async getById(id: string, options: { tenantId: string }): Promise<Required<Application> | undefined> {
    const response = await DB.pool?.query<Required<Application>>(
      `
      SELECT id, name, redirect_uri as "redirectUri", is_public as "isPublic" 
      FROM ${options.tenantId}.applications 
      WHERE id = $1;
      `,
      [id]
    );

    if (!response) {
      throw new Error();
    }

    return response.rows.length === 0 ? undefined : response.rows[0];
  }

  static async getAll(options: QueryOptions): Promise<Required<Application>[]> {
    const response = await DB.pool?.query<Required<Application>>(
      `
      SELECT id, name, redirect_uri as "redirectUri", is_public as "isPublic" 
      FROM ${options.tenantId}.applications 
      `
    );

    if (!response) {
      throw new Error();
    }

    return response.rows;
  }
}
