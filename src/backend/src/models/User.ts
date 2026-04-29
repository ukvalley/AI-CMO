/**
 * User Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface IUser extends Document {
  email: string;
  name: string;
  role: UserRole;
  companyIds: string[];
  activeCompanyId: string | null;
  avatar?: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  companyIds: [{
    type: String,
    index: true
  }],
  activeCompanyId: {
    type: String,
    default: null
  },
  avatar: {
    type: String
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
      return ret;
    }
  }
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ companyIds: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  // Only hash if it's not already hashed (starts with $2a$)
  if (!this.passwordHash.startsWith('$2a$')) {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
