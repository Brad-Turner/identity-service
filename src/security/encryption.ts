import bcrypt from 'bcrypt';
import { UserWithPassword, EncryptedUser } from '../types';

const WORK_FACTOR = 12; // 2 ^ WORK_FACTOR rounds for salt calculation

// TODO: bcrypt only supports 72 bytes max, might need to use another hashing algorithm first to mandate length < 72 bytes.

export async function encryptUser(user: UserWithPassword): Promise<EncryptedUser> {
  const { password, ...other } = user;

  const passwordHash = await bcrypt.hash(user.password, WORK_FACTOR);

  return { ...other, passwordHash };
}

export async function validatePassword(plaintext: string, passwordHash: string, salt: string): Promise<boolean> {
  return bcrypt.compare(plaintext, `${salt}${passwordHash}`);
}
