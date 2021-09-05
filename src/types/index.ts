export type TenantId = `"${string}"`;

export interface Application {
  id?: string;
  name: string;
  redirectUri: string;
  isPublic: boolean;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;

  active?: boolean;
  emailVerified?: boolean;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface EncryptedUser extends User {
  passwordHash: string;
}

interface OpenIdConnectClient {
  applicationType: 'web';
  redirectUris: string[];
  name: string;
  logoUri: string;
  contacts: string[];
  requestUris: string[];
}

interface RegistrationResponse {
  clientId: string;
  clientSecret: string;
}

export interface Tenant {
  id?: string;
  name: string;
  domain: string;
}

export interface QueryOptions {
  tenantId: TenantId;
}

export interface HealthStatus {
  checkedAt: Date;
  totalCount?: number;
  idleCount?: number;
  waitingCount?: number;
}
