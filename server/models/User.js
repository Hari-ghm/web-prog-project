import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema(
  {
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    timeFormat: { type: String, default: '12-hour' },
    theme: { type: String, default: 'dark' },
    emailAlerts: { type: Boolean, default: true },
    systemNotif: { type: Boolean, default: true },
    alertThreshold: { type: String, default: 'high' },
    refreshInterval: { type: String, default: '10s' },
    language: { type: String, default: 'en' },
    units: { type: String, default: 'metric' },
    dataRetention: { type: String, default: '30days' },
    openWeatherApiKey: { type: String, default: '' },
    nasaPowerApiKey: { type: String, default: '' },
    selectedState: { type: String, default: 'tamil-nadu' },
    selectedCity: { type: String, default: 'chennai' },
    timeframe: { type: String, default: 'Daily' }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
    preferences: { type: preferencesSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
