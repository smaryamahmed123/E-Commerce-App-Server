import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  sendAuthEmail  from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (isAdmin && !adminApprovalList.includes(email)) {
      return res.status(403).json({ message: 'Admin access must be granted by existing admin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user',
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    sendAuthEmail(email, 'Welcome to Our App', `Hello ${firstName} ${lastName}, welcome to our app!`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch =  bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    sendAuthEmail(email, 'Login Notification', `Hello ${user.firstName}, you have successfully logged in!`);

    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const googleSignUp = async (req, res) => {
  const { tokenId } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  if (!tokenId) {
    return res.status(400).json({ message: 'Token ID is missing' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await User.findOne({ googleId });

    if (user) {
      return res.status(400).json({ message: 'User already exists. Please log in instead.' });
    }

    user = new User({ googleId, email, name, avatar });
    await user.save();

    const token = jwt.sign(
      { id: user._id, googleId: user.googleId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '60d' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error('Error during Google signup:', error);
    res.status(400).json({ message: 'Google signup failed' });
  }
};



const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  if (!tokenId) {
    return res.status(400).json({ message: 'Token ID is missing' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    const token = jwt.sign(
      { id: user._id, googleId: user.googleId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '60d' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(400).json({ message: 'Google login failed' });
  }
};

const googleLogOut = (req, res) => {
  console.log('Logout request received');
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to logout:', err);
      return res.status(500).json({ message: 'Failed to logout.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully.' });
  });
}
export { registerUser, loginUser, googleSignUp, googleLogOut, googleLogin };


