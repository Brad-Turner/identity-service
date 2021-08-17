export type TenantId = `"${string}"`;

export interface Application {
  id?: string;
  name: string;
  redirectUri: string;
  isPublic: boolean;
}

export interface Tenant {
  id?: string;
  name: string;
  domain: string;
}

export interface QueryOptions {
  tenantId: TenantId;
}
