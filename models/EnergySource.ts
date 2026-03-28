import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnergySource {
  _id: string;
  name: string;
  type: 'solar' | 'wind' | 'hydro';
  state: string;
  city: string;
  capacityKW: number;
  status: 'active' | 'inactive' | 'maintenance';
  installedDate: Date;
  lat?: number;
  lng?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EnergySourceSchema = new Schema<IEnergySource>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['solar', 'wind', 'hydro'], required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    capacityKW: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
    installedDate: { type: Date, default: Date.now },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

export default models.EnergySource || model<IEnergySource>('EnergySource', EnergySourceSchema);
