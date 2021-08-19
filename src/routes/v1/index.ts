import express from 'express';
import { ApplicationsService, OAuthService } from '../../services';

const router = express.Router();

router
  .route('/applications') //
  .get(ApplicationsService.listAll)
  .post(ApplicationsService.create);

router
  .route('/applications/:applicationId') //
  .get(ApplicationsService.get);

router.post('/oauth2/authorize', OAuthService.authorise);

export default router;
