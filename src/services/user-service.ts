import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import url from 'url';

import { UserRepository } from '../repositories';
import { encryptUser } from '../security';
import EnvironmentHandler from '../environment-handler';
import EmailService from './email-service';

const { environment } = new EnvironmentHandler();
const emailService = new EmailService(environment.smtp.domain, environment.smtp.key);

export default class UserService {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { firstName, lastName, email, password } = req.body;

    try {
      const user = await encryptUser({ firstName, lastName, email, password });

      const response = await UserRepository.create(user);

      if (response) {
        const fullName = `${response.firstName} ${response.lastName}`;

        req.log.info(`Created database entry for user: ${fullName}`);

        const verifyToken = jwt.sign({ id: response.id }, environment.jwtKey, { expiresIn: '1d' });
        req.log.debug(`Created verification token for user: ${fullName}`);

        const verifyLink = url.format({
          protocol: req.protocol,
          host: req.get('host'),
          pathname: `/auth/verify`,
          query: { token: verifyToken }
        });

        await emailService.sendEmailVerification(email, verifyLink);
        req.log.info(`Sent verification email for user: ${fullName}`);
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async setAsVerified(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.query.token;

      if (typeof token !== 'string') {
        throw new Error("Invalid query parameter 'token'");
      }

      const user = jwt.verify(token, environment.jwtKey);

      if (typeof user === 'string') {
        throw new JsonWebTokenError('Expected object, received string.');
      }

      await UserRepository.setIsVerified(user.id);
      req.log.info(`Set user as verified: ${user.id}`);

      res.redirect('/login');
    } catch (err) {
      next(err);
    }
  }
}
