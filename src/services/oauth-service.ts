import { NextFunction, Request, Response } from 'express';
import { ApplicationRepository } from '../repositories';

export default class OAuthService {
  static async authorise(req: Request, res: Response, next: NextFunction) {
    let redirectUri;
    const clientId = req.query.client_id;
    const responseType = req.query.response_type;

    try {
      if (!clientId) {
        throw new Error('Missing query param client_id');
      }

      const application = await ApplicationRepository.getById(clientId as string, {
        tenantId: `"${res.locals.tenant.id}"`
      });

      if (!application) {
        throw new Error('Invalid application');
      }

      if (application.redirectUri !== req.query.redirect_uri) {
        throw new Error('Invalid redirect URI');
      }

      // res.status(301).redirect(req.query.redirect_uri);
      res.status(200).send({ message: 'OK' });
    } catch (err) {
      next(err);
    }
  }
}
