import { Request, Response, NextFunction } from 'express';
import { TenantRepository } from '../repositories';
import { InvalidTenantDomainError } from '../errors';

export async function validateTenantDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.params.tenantDomain) {
      throw new InvalidTenantDomainError('not defined');
    }

    const tenant = await TenantRepository.findByDomain(req.params.tenantDomain);
    if (!tenant) {
      throw new InvalidTenantDomainError(req.params.tenantDomain);
    }

    res.locals = { ...res.locals, tenant };
    next();
  } catch (err) {
    next(err);
  }
}
