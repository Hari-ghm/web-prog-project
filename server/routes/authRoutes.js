import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
  preferences: user.preferences
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '7d' }
  );

  await AuditLog.create({
    user: user.email,
    action: 'Session Login',
    status: 'Success'
  });

  return res.json({ user: sanitizeUser(user), token });
});

router.post('/logout', async (_req, res) => {
  return res.json({ ok: true });
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json({ user: sanitizeUser(user) });
});

export default router;
