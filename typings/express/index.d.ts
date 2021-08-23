import { EncryptedUser } from '../../src/types';

declare global {
  namespace Express {
    export interface User extends EncryptedUser {
      id: string;
    }
  }
}
