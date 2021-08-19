export abstract class UserError extends Error {
  protected statusCode: number;

  constructor() {
    super();
    this.name = this.constructor.name;
    this.statusCode = 400;
  }
}

export class InvalidTenantDomainError extends UserError {
  constructor(tenantDomain: string) {
    super();
    this.name = this.constructor.name;
    this.message = `Tenant domain could not be resolved: ${tenantDomain}.`;
  }
}
