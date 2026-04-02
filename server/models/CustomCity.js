import mongoose from 'mongoose';

const customCitySchema = new mongoose.Schema(
  {
    stateId: { type: String, required: true, index: true, trim: true },
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

customCitySchema.index({ stateId: 1, id: 1 }, { unique: true });

export const CustomCity = mongoose.model('CustomCity', customCitySchema);
