import mongoose from 'mongoose';

const customStateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

export const CustomState = mongoose.model('CustomState', customStateSchema);
