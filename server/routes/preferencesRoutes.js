import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

const allowedKeys = new Set([
  'dateFormat',
  'timeFormat',
  'theme',
  'emailAlerts',
  'systemNotif',
  'alertThreshold',
  'refreshInterval',
  'language',
  'units',
  'dataRetention',
  'openWeatherApiKey',
  'nasaPowerApiKey',
  'selectedState',
  'selectedCity',
  'timeframe'
]);

router.get('/', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('preferences');
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ preferences: user.preferences || {} });
});

router.put('/', authMiddleware, async (req, res) => {
  const updates = req.body || {};
  const sanitized = {};

  Object.keys(updates).forEach((key) => {
    if (allowedKeys.has(key)) {
      sanitized[`preferences.${key}`] = updates[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: sanitized },
    { new: true, runValidators: true }
  ).select('preferences');

  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ preferences: user.preferences || {} });
});

export default router;
