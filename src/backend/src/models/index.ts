/**
 * Models Index
 * Dynamically loads real or mock models based on database mode
 */

import mongoose, { Model, Schema } from 'mongoose';
import { isMockMode, mockDB } from '../utils/database';

// ============================================
// MOCK MODEL IMPLEMENTATION
// ============================================

class MockModel<T extends { id: string; save?: () => Promise<T>; comparePassword?: (p: string) => Promise<boolean> }> {
  private collection: Map<string, T> = new Map();

  async findOne(query: Partial<T>): Promise<T | null> {
    const key = Object.keys(query)[0] as keyof T;
    for (const item of this.collection.values()) {
      if ((item as any)[key] === (query as any)[key]) {
        return this.addMethods(item);
      }
    }
    return null;
  }

  async find(query?: any): Promise<T[]> {
    let items = Array.from(this.collection.values());
    if (query?._id?.$in) {
      items = items.filter((item: any) => query._id.$in.includes(item.id));
    }
    return items.map(item => this.addMethods(item));
  }

  async findById(id: string): Promise<T | null> {
    const item = this.collection.get(id);
    return item ? this.addMethods(item) : null;
  }

  async findByIdAndDelete(id: string): Promise<void> {
    this.collection.delete(id);
  }

  create(data: Partial<T>): T {
    const id = Math.random().toString(36).substring(2, 15);
    const item: any = {
      ...data,
      _id: id,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.collection.set(id, item);
    return this.addMethods(item);
  }

  // Add mock methods
  private addMethods(item: any): T {
    if (!item.save) {
      item.save = async () => {
        item.updatedAt = new Date().toISOString();
        return item;
      };
    }
    if (!item.comparePassword && item.passwordHash) {
      item.comparePassword = async (password: string) => {
        return mockDB.comparePassword(password, item.passwordHash);
      };
    }
    return item;
  }
}

// ============================================
// DYNAMIC MODEL LOADER
// ============================================

let models: any = null;

export const loadModels = () => {
  if (models) return models;

  if (isMockMode()) {
    // Return mock models
    models = {
      User: new MockModel<any>('users'),
      Company: new MockModel<any>('companies'),
      BusinessProfile: new MockModel<any>('businessProfiles'),
      Product: new MockModel<any>('products'),
      ProductCategory: new MockModel<any>('productCategories'),
      Founder: new MockModel<any>('founders'),
      Employee: new MockModel<any>('employees'),
      ICP: new MockModel<any>('icps'),
      Persona: new MockModel<any>('personas'),
      Competitor: new MockModel<any>('competitors'),
    };
  } else {
    // Import and return real models
    const { User: RealUser } = require('./User');
    const { Company: RealCompany } = require('./Company');
    const { BusinessProfile: RealBusinessProfile } = require('./BusinessProfile');
    const { Product: RealProduct, ProductCategory: RealProductCategory } = require('./Product');
    const { Founder: RealFounder } = require('./Founder');
    const { Employee: RealEmployee } = require('./Employee');
    const { ICP: RealICP } = require('./ICP');
    const { Persona: RealPersona } = require('./Persona');
    const { Competitor: RealCompetitor } = require('./Competitor');

    models = {
      User: RealUser,
      Company: RealCompany,
      BusinessProfile: RealBusinessProfile,
      Product: RealProduct,
      ProductCategory: RealProductCategory,
      Founder: RealFounder,
      Employee: RealEmployee,
      ICP: RealICP,
      Persona: RealPersona,
      Competitor: RealCompetitor,
    };
  }

  return models;
};

// Export getter functions that load models dynamically
export const getModels = () => loadModels();

export const User = () => getModels().User;
export const Company = () => getModels().Company;
export const BusinessProfile = () => getModels().BusinessProfile;
export const Product = () => getModels().Product;
export const ProductCategory = () => getModels().ProductCategory;
export const Founder = () => getModels().Founder;
export const Employee = () => getModels().Employee;
export const ICP = () => getModels().ICP;
export const Persona = () => getModels().Persona;
export const Competitor = () => getModels().Competitor;

// Re-export types
export type { IUser, UserRole } from './User';
export type { ICompany } from './Company';
export type { IBusinessProfile } from './BusinessProfile';
export type { IProduct, IProductCategory } from './Product';
export type { IFounder } from './Founder';
export type { IEmployee } from './Employee';
export type { IICP } from './ICP';
export type { IPersona } from './Persona';
export type { ICompetitor } from './Competitor';
