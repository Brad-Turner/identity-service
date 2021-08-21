import { Express } from 'express';

import helmet from 'helmet';

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
