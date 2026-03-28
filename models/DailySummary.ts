import mongoose, { Schema, models, model } from 'mongoose';

export interface IDailySummary {
  _id: string;
  date: Date;
  totalEnergyKWh: number;
  solarEnergyKWh: number;
  windEnergyKWh: number;
  hydroEnergyKWh: number;
  co2SavedKg: number;
  state: string;
  city: string;
}

const DailySummarySchema = new Schema<IDailySummary>({
  date: { type: Date, required: true },
  totalEnergyKWh: { type: Number, required: true, default: 0 },
  solarEnergyKWh: { type: Number, default: 0 },
  windEnergyKWh: { type: Number, default: 0 },
  hydroEnergyKWh: { type: Number, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  state: { type: String, required: true },
  city: { type: String, required: true },
});

DailySummarySchema.index({ date: 1, state: 1, city: 1 });

export default models.DailySummary || model<IDailySummary>('DailySummary', DailySummarySchema);
