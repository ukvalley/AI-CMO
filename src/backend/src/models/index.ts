/**
 * Models Index
 * Dynamically loads real or mock models based on database mode
 */

import mongoose, { Model, Schema } from 'mongoose';
import { isMockMode, mockDB } from '../utils/database';

// ============================================
// MOCK MODEL IMPLEMENTATION
// ============================================

/**
 * Creates a mock model that behaves like a Mongoose model constructor.
 * Supports `new Model(data)` + `.save()`, `Model.create(data)`,
 * `Model.findOne()`, `Model.find()`, `Model.findById()`, `Model.findByIdAndDelete()`.
 */
function createMockModel<T extends Record<string, any>>(name: string) {
  const collection = new Map<string, any>();

  function Model(data: Record<string, any>) {
    const id = Math.random().toString(36).substring(2, 15);
    const item: any = {
      ...data,
      _id: id,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    collection.set(id, item);
    addMethods(item);
    return item;
  }

  function addMethods(item: any): any {
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

  Model.findOne = async (query: Record<string, any>): Promise<any | null> => {
    const key = Object.keys(query)[0];
    for (const item of collection.values()) {
      if (item[key] === query[key]) {
        return addMethods({ ...item });
      }
    }
    return null;
  };

  Model.find = async (query?: any): Promise<any[]> => {
    let items = Array.from(collection.values());
    if (query?._id?.$in) {
      items = items.filter((item: any) => query._id.$in.includes(item.id));
    }
    return items.map((item: any) => addMethods({ ...item }));
  };

  Model.findById = async (id: string): Promise<any | null> => {
    const item = collection.get(id);
    return item ? addMethods({ ...item }) : null;
  };

  Model.findByIdAndDelete = async (id: string): Promise<any> => {
    const item = collection.get(id);
    collection.delete(id);
    return item || null;
  };

  Model.create = (data: Record<string, any>): any => {
    return Model(data);
  };

  Model.findByIdAndUpdate = async (id: string, update: any, options?: any): Promise<any | null> => {
    const item = collection.get(id);
    if (!item) return null;
    Object.assign(item, update, { updatedAt: new Date().toISOString() });
    return addMethods(item);
  };

  Model.deleteOne = async (query: Record<string, any>): Promise<void> => {
    const key = Object.keys(query)[0];
    for (const [id, item] of collection.entries()) {
      if (item[key] === query[key]) {
        collection.delete(id);
        return;
      }
    }
  };

  Model.countDocuments = async (): Promise<number> => {
    return collection.size;
  };

  return Model;
}

// ============================================
// DYNAMIC MODEL LOADER
// ============================================

let models: any = null;

export const loadModels = () => {
  if (models) return models;

  if (isMockMode()) {
    // Return mock models that act as constructors
    models = {
      User: createMockModel('users'),
      Company: createMockModel('companies'),
      BusinessProfile: createMockModel('businessProfiles'),
      Product: createMockModel('products'),
      ProductCategory: createMockModel('productCategories'),
      Founder: createMockModel('founders'),
      Employee: createMockModel('employees'),
      ICP: createMockModel('icps'),
      Persona: createMockModel('personas'),
      Competitor: createMockModel('competitors'),
      Brand: createMockModel('brands'),
      BrandAsset: createMockModel('brandAssets'),
      Stationery: createMockModel('stationery'),
      HRAsset: createMockModel('hrAssets'),
      WebsitePage: createMockModel('websitePages'),
      Blog: createMockModel('blogs'),
      BlogContentOS: createMockModel('blogContentOS'),
      NewsletterContentOS: createMockModel('newsletterContentOS'),
      Newsletter: createMockModel('newsletters'),
      LandingPageContentOS: createMockModel('landingPageContentOS'),
      FAQ: createMockModel('faqs'),
      FAQCategory: createMockModel('faqCategories'),
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
    const { Brand: RealBrand } = require('./Brand');
    const { BrandAsset: RealBrandAsset } = require('./BrandAsset');
    const { Stationery: RealStationery } = require('./Stationery');
    const { HRAsset: RealHRAsset } = require('./HRAsset');
    const { WebsitePage: RealWebsitePage } = require('./WebsitePage');
    const { Blog: RealBlog } = require('./Blog');
    const { BlogContentOS: RealBlogContentOS } = require('./BlogContentOS');
    const { NewsletterContentOS: RealNewsletterContentOS } = require('./NewsletterContentOS');
    const { Newsletter: RealNewsletter } = require('./Newsletter');
    const { LandingPageContentOS: RealLandingPageContentOS } = require('./LandingPageContentOS');
    const { FAQ: RealFAQ, FAQCategory: RealFAQCategory } = require('./FAQ');

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
      Brand: RealBrand,
      BrandAsset: RealBrandAsset,
      Stationery: RealStationery,
      HRAsset: RealHRAsset,
      WebsitePage: RealWebsitePage,
      Blog: RealBlog,
      BlogContentOS: RealBlogContentOS,
      NewsletterContentOS: RealNewsletterContentOS,
      Newsletter: RealNewsletter,
      LandingPageContentOS: RealLandingPageContentOS,
      FAQ: RealFAQ,
      FAQCategory: RealFAQCategory,
    };
  }

  return models;
};

// Export getter functions that load models dynamically
export const getModels = () => loadModels();

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
export type { IBrand } from './Brand';
export type { IBrandAsset } from './BrandAsset';
export type { IStationery } from './Stationery';
export type { IHRAsset } from './HRAsset';
export type { IWebsitePage } from './WebsitePage';
export type { IBlog } from './Blog';
export type { IBlogContentOS } from './BlogContentOS';
export type { INewsletterContentOS } from './NewsletterContentOS';
export type { INewsletter } from './Newsletter';
export type { ILandingPageContentOS } from './LandingPageContentOS';
export type { IFAQ, IFAQCategory } from './FAQ';
