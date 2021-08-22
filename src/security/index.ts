import { Express } from 'express';

import helmet from 'helmet';
import { encryptUser, validatePassword } from './encryption';

export function setupSecurity(app: Express) {
  app.use(
    helmet({
      expectCt: false,
      frameguard: { action: 'deny' },
      originAgentCluster: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    })
  );
}

export { encryptUser, validatePassword };
