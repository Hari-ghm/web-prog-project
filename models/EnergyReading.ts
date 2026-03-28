import mongoose, { Schema, models, model } from 'mongoose';

export interface IEnergyReading {
  _id: string;
  sourceId: mongoose.Types.ObjectId;
  outputKW: number;
  timestamp: Date;
}

const EnergyReadingSchema = new Schema<IEnergyReading>({
  sourceId: { type: Schema.Types.ObjectId, ref: 'EnergySource', required: true },
  outputKW: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default models.EnergyReading || model<IEnergyReading>('EnergyReading', EnergyReadingSchema);
