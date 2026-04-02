import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import { connectToDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import preferencesRoutes from './routes/preferencesRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { User } from './models/User.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const app = express();
const PORT = Number(process.env.PORT || 4000);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_URL
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/admin', adminRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

const seedDefaultAdmin = async () => {
  const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@ecodash.com').toLowerCase();
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const name = process.env.DEFAULT_ADMIN_NAME || 'admin';

  const existing = await User.findOne({ email });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    email,
    name,
    passwordHash,
    role: 'admin'
  });

  console.log(`Seeded default admin user: ${email}`);
};

const start = async () => {
  await connectToDatabase();
  await seedDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
