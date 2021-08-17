import { Request, Response, NextFunction } from 'express';
import { TenantRepository } from '../repositories';

export async function validateTenantDomain(req: Request, res: Response, next: NextFunction) {
  if (!req.params.tenantDomain) {
    return next(new Error('Missing parameter tenantDomain'));
  }

  try {
    const tenant = await TenantRepository.findByDomain(req.params.tenantDomain);
    if (!tenant) {
      throw new Error('Invalid tenant');
    }

    res.locals = { ...res.locals, tenant };
    next();
  } catch (err) {
    next(err);
  }
}
