/**
 * Landing Page Content OS Model
 *
 * Stores landing page operating system data per company.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ILandingPageContentOS extends Document {
  companyId: string;
  pages: any[];
  templates: any[];
  exports: any[];
  createdAt: Date;
  updatedAt: Date;
}

const LandingPageContentOSSchema = new Schema<ILandingPageContentOS>(
  {
    companyId: {
      type: String,
      required: [true, 'Company ID is required'],
      index: true,
      unique: true,
    },
    pages: { type: [Schema.Types.Mixed] as any, default: [] },
    templates: { type: [Schema.Types.Mixed] as any, default: [] },
    exports: { type: [Schema.Types.Mixed] as any, default: [] },
  },
  {
    timestamps: true,
  }
);

export const LandingPageContentOS = mongoose.model<ILandingPageContentOS>('LandingPageContentOS', LandingPageContentOSSchema);
