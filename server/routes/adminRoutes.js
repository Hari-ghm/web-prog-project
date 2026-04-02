import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { CustomState } from '../models/CustomState.js';
import { CustomCity } from '../models/CustomCity.js';
import { AuditLog } from '../models/AuditLog.js';

const router = express.Router();

const toTimeString = (date) => new Date(date).toLocaleTimeString();

router.get('/config', authMiddleware, async (req, res) => {
  const [states, cities, logs] = await Promise.all([
    CustomState.find().sort({ createdAt: 1 }).lean(),
    CustomCity.find().sort({ createdAt: 1 }).lean(),
    AuditLog.find().sort({ timestamp: -1 }).limit(50).lean()
  ]);

  const customCities = cities.reduce((acc, city) => {
    if (!acc[city.stateId]) acc[city.stateId] = [];
    acc[city.stateId].push({
      id: city.id,
      name: city.name,
      lat: city.lat,
      lon: city.lon
    });
    return acc;
  }, {});

  return res.json({
    customStates: states.map((s) => ({ id: s.id, name: s.name, active: s.active })),
    customCities,
    auditLogs: logs.map((log) => ({
      time: toTimeString(log.timestamp),
      user: log.user,
      action: log.action,
      status: log.status
    }))
  });
});

router.post('/states', authMiddleware, async (req, res) => {
  const { id, name, active = true } = req.body || {};
  if (!id || !name) {
    return res.status(400).json({ message: 'State id and name are required.' });
  }

  const existing = await CustomState.findOne({ id });
  if (existing) {
    return res.status(409).json({ message: 'State already exists.' });
  }

  await CustomState.create({
    id,
    name,
    active,
    createdBy: req.user.email
  });

  await AuditLog.create({
    user: req.user.email,
    action: `Added State: ${name}`,
    status: 'Success'
  });

  return res.status(201).json({ ok: true });
});

router.post('/cities', authMiddleware, async (req, res) => {
  const { stateId, id, name, lat, lon } = req.body || {};
  if (!stateId || !id || !name || lat === undefined || lon === undefined) {
    return res.status(400).json({ message: 'City stateId, id, name, lat and lon are required.' });
  }

  const existing = await CustomCity.findOne({ stateId, id });
  if (existing) {
    return res.status(409).json({ message: 'City already exists in this state.' });
  }

  await CustomCity.create({
    stateId,
    id,
    name,
    lat: Number(lat),
    lon: Number(lon),
    createdBy: req.user.email
  });

  await AuditLog.create({
    user: req.user.email,
    action: `Added City: ${name}`,
    status: 'Success'
  });

  return res.status(201).json({ ok: true });
});

export default router;
