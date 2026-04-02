import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
