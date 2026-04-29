/**
 * Persona Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IPersona extends Document {
  name: string;
  companyId: string;
  icpId: string;
  age?: string;
  job?: string;
  goals?: string[];
  painPoints?: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PersonaSchema = new Schema<IPersona>({
  name: {
    type: String,
    required: [true, 'Persona name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  icpId: {
    type: String,
    required: [true, 'ICP ID is required'],
    index: true
  },
  age: String,
  job: String,
  goals: [String],
  painPoints: [String],
  bio: String
}, {
  timestamps: true
});

PersonaSchema.index({ companyId: 1 });
PersonaSchema.index({ companyId: 1, icpId: 1 });

export const Persona = mongoose.model<IPersona>('Persona', PersonaSchema);
