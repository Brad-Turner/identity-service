export abstract class UserError extends Error {
  public statusCode: number;

  constructor(statusCode = 400) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class InvalidTenantDomainError extends UserError {
  constructor(tenantDomain: string) {
    super(404);
    this.name = this.constructor.name;
    this.message = `Tenant domain could not be resolved: ${tenantDomain}.`;
  }
}

export class InvalidUserError extends UserError {
  constructor() {
    super(401);
    this.name = this.constructor.name;
    this.message = `Invalid email or password.`;
  }
}
