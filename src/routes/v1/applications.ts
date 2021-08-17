import express from 'express';
import { ApplicationRepository } from '../../repositories';

const router = express.Router();

router
  .route('/applications')
  .get(async (req, res, next) => {
    try {
      const applications = await ApplicationRepository.getAll({ tenantId: `"${res.locals.tenant.id}"` });
      res.send({ applications });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
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
  });

router.route('/applications/:applicationId').get(async (req, res, next) => {
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
});

export default router;
