import mongoose, { Schema, models, model } from 'mongoose';

export interface IAlert {
  _id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  sourceId?: mongoose.Types.ObjectId;
  acknowledged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    severity: { type: String, enum: ['critical', 'warning', 'info'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    sourceId: { type: Schema.Types.ObjectId, ref: 'EnergySource' },
    acknowledged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Alert || model<IAlert>('Alert', AlertSchema);
