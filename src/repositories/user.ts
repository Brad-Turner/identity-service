import DB from '../db';
import { EncryptedUser, User } from '../types';

export class UserRepository {
  static async create(user: EncryptedUser): Promise<Required<User> | undefined> {
    const response = await DB.pool?.query<Required<User>>(
      `
        INSERT INTO users(first_name, last_name, email, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, first_name as "firstName", last_name as "lastName", email;
      `,
      [user.firstName, user.lastName, user.email, user.passwordHash]
    );

    if (!response) {
      throw new Error();
    }

    return response.rows.length === 0 ? undefined : response.rows[0];
  }

  static async getById(id: string): Promise<Required<EncryptedUser> | undefined> {
    const response = await DB.pool?.query<Required<EncryptedUser>>(
      `
        SELECT
          id,
          first_name as "firstName",
          last_name as "lastName",
          email,
          password_hash as "passwordHash"
        FROM users
        WHERE id = $1;
      `,
      [id]
    );

    if (!response) {
      throw new Error();
    }

    return response.rows.length === 0 ? undefined : response.rows[0];
  }
}
