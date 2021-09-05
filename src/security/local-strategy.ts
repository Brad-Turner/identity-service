import { Strategy as LocalStrategy } from 'passport-local';
import { validatePassword } from './encryption';
import { UserRepository } from '../repositories';
import { InvalidUserError } from '../errors';

export const localStrategy = new LocalStrategy(
  { usernameField: 'email', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const user = await UserRepository.getByEmail(email);

      // It is important to still calculate the hash for an invalid user's password.
      // This presents approximately the same time for (in)valid credentials.
      // The aim is to prevent attackers using response time to gain information about the service.
      const isAuthenticated = await validatePassword(password, user?.passwordHash ?? '-');

      if (!user || !isAuthenticated) {
        req.log.warn(`Unauthenticated login attempt for email: ${email}`);
        throw new InvalidUserError();
      }

      if (!user.active) {
        req.log.warn(`Inactive user login attempt for email: ${email}`);
        throw new InvalidUserError();
      }

      if (!user.emailVerified) {
        req.log.warn(`Unverified account login attempt for email: ${email}`);
        throw new InvalidUserError();
      }

      done(undefined, user);
    } catch (err) {
      done(err);
    }
  }
);
