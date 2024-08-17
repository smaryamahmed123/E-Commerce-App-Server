import express from 'express';
import { registerUser, loginUser, googleSignUp, googleLogOut, googleLogin } from '../controllers/authController.js';
import passport from 'passport';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: `${process.env.CLIENT_URL}/`,
  failureRedirect: `${process.env.CLIENT_URL}/login`
}));

router.post('/google/signup', googleSignUp);
router.post('/google/login', googleLogin);
router.post('/logout', googleLogOut);




export default router;
