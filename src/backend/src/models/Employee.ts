/**
 * Employee Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export type Department =
  | 'engineering' | 'marketing' | 'sales' | 'design'
  | 'operations' | 'hr' | 'finance' | 'customer-success'
  | 'product' | 'legal' | 'other';

export type EmployeeLevel =
  | 'intern' | 'junior' | 'mid' | 'senior'
  | 'lead' | 'manager' | 'director' | 'vp' | 'c-suite';

export type ResponsibilityArea =
  | 'vision' | 'tech' | 'sales' | 'marketing' | 'operations' | 'finance' | 'product' | 'hr';

export interface IEmployeeAsset {
  id: string;
  type: string;
  name: string;
  url?: string;
  base64Data?: string;
  createdAt: string;
}

export interface ISocialProfiles {
  linkedIn?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tikTok?: string;
  youTube?: string;
  github?: string;
  website?: string;
}

export interface IEmployee extends Document {
  name: string;
  companyId: string;
  title?: string;
  department?: Department;
  level?: EmployeeLevel;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  workAnniversary?: string;
  expertise?: string[];
  responsibilityArea?: ResponsibilityArea;
  reportsTo?: string;
  bio?: string;
  socialProfiles: ISocialProfiles;
  assets: IEmployeeAsset[];
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  title: String,
  department: {
    type: String,
    enum: ['engineering', 'marketing', 'sales', 'design', 'operations', 'hr', 'finance', 'customer-success', 'product', 'legal', 'other']
  },
  level: {
    type: String,
    enum: ['intern', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'vp', 'c-suite']
  },
  email: String,
  phone: String,
  city: String,
  country: String,
  dateOfBirth: String,
  workAnniversary: String,
  expertise: [String],
  responsibilityArea: {
    type: String,
    enum: ['vision', 'tech', 'sales', 'marketing', 'operations', 'finance', 'product', 'hr']
  },
  reportsTo: String,
  bio: String,
  socialProfiles: {
    type: Object,
    default: {}
  },
  assets: {
    type: [{
      id: String,
      type: String,
      name: String,
      url: String,
      base64Data: String,
      createdAt: String
    }],
    default: []
  }
}, {
  timestamps: true
});

EmployeeSchema.index({ companyId: 1 });
EmployeeSchema.index({ companyId: 1, department: 1 });
EmployeeSchema.index({ companyId: 1, level: 1 });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
