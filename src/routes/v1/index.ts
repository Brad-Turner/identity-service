import express from 'express';
import { ApplicationRepository } from '../../repositories';
import ApplicationRoutes from './applications';

const router = express.Router();

router.use(ApplicationRoutes);

router.post('/oauth2/authorize', async (req, res, next) => {
  try {
    res.status(200).send({ message: 'OK' });
  } catch (err) {
    next(err);
  }
});

export default router;
