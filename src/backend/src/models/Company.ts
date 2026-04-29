/**
 * Company Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  notificationEmail?: string;
  userIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  notificationEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  userIds: [{
    type: String,
    index: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CompanySchema.index({ userIds: 1 });
CompanySchema.index({ isActive: 1 });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
