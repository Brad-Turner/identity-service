import { Router } from 'express';
import passport from 'passport';

import UserService from '../../services/user-service';

const router = Router();

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }));
router.post('/signup', UserService.create);
router.get('/verify', UserService.setAsVerified);

export default router;
