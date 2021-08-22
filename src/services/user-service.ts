import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories';
import { encryptUser } from '../security';

export default class UserService {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { firstName, lastName, email, password } = req.body;

    try {
      const user = await encryptUser({ firstName, lastName, email, password });

      const response = await UserRepository.create(user);

      if (!response) {
        throw new Error('Create failed');
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
