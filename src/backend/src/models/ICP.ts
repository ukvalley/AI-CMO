/**
 * ICP (Ideal Customer Profile) Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IICP extends Document {
  name: string;
  companyId: string;
  description?: string;
  isActive: boolean;
  industry?: string;
  companySize?: string;
  location?: string;
  painPoints?: string[];
  goals?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ICPSchema = new Schema<IICP>({
  name: {
    type: String,
    required: [true, 'ICP name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  industry: String,
  companySize: String,
  location: String,
  painPoints: [String],
  goals: [String]
}, {
  timestamps: true
});

ICPSchema.index({ companyId: 1 });
ICPSchema.index({ companyId: 1, isActive: 1 });

export const ICP = mongoose.model<IICP>('ICP', ICPSchema);
