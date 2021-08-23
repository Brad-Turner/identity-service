import { Express } from 'express';

import helmet from 'helmet';
import passport from 'passport';

import { InvalidUserError } from '../errors';
import { UserRepository } from '../repositories';
import { encryptUser, validatePassword } from './encryption';
import { localStrategy } from './local-strategy';

export function setupSecurity(app: Express): void {
  app.use(
    helmet({
      expectCt: false,
      frameguard: { action: 'deny' },
      originAgentCluster: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    })
  );

  passport.use(localStrategy);

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    const user = await UserRepository.getById(id);

    if (!user) {
      return done(new InvalidUserError());
    }

    done(null, user);
  });

  app.use(passport.initialize());
}

export { encryptUser, validatePassword };
