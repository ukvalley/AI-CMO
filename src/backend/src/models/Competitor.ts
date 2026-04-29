/**
 * Competitor Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ICompetitor extends Document {
  name: string;
  companyId: string;
  website?: string;
  threatLevel: ThreatLevel;
  usp?: string;
  strengths?: string;
  weaknesses?: string;
  swot?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitorSchema = new Schema<ICompetitor>({
  name: {
    type: String,
    required: [true, 'Competitor name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Company ID is required'],
    index: true
  },
  website: String,
  threatLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  usp: String,
  strengths: String,
  weaknesses: String,
  swot: String
}, {
  timestamps: true
});

CompetitorSchema.index({ companyId: 1 });
CompetitorSchema.index({ companyId: 1, threatLevel: 1 });

export const Competitor = mongoose.model<ICompetitor>('Competitor', CompetitorSchema);
