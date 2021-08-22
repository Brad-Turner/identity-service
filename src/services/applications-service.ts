import { NextFunction, Request, Response } from 'express';
import { ApplicationRepository } from '../repositories';

export default class ApplicationsService {
  static async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applications = await ApplicationRepository.getAll({ tenantId: `"${res.locals.tenant.id}"` });
      res.send({ applications });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const application = await ApplicationRepository.getById(req.params.applicationId, {
        tenantId: `"${res.locals.tenant.id}"`
      });

      if (!application) {
        throw new Error('Invalid application');
      }

      res.send(application);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // TODO: validate req body
    const { name, redirectUri, isPublic = false } = req.body;

    try {
      const application = await ApplicationRepository.create(
        { name, redirectUri, isPublic },
        { tenantId: `"${res.locals.tenant.id}"` }
      );

      if (!application) {
        throw new Error('Create failed');
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
