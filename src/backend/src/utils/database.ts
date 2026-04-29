/**
 * Database Connection
 * Falls back to mock database if MongoDB is not available
 */

import mongoose from 'mongoose';
import mockDB from './mockDatabase';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_cmo';

let useMock = false;

// Connection options
const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Connect to MongoDB or use mock
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    useMock = false;
    console.log('✅ Connected to MongoDB');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Using mock database...');
      useMock = true;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      useMock = false;
    });

  } catch (error) {
    console.warn('⚠️ MongoDB not available. Using in-memory mock database for development...');
    console.warn('   To use real MongoDB, install it with: brew install mongodb-community');
    console.warn('   Or use Docker: docker run -d -p 27017:27017 mongo:7');
    useMock = true;
  }
};

/**
 * Check if using mock database
 */
export const isMockMode = (): boolean => useMock;

/**
 * Get User model (real or mock)
 */
export const getUserModel = () => {
  if (useMock) {
    return mockDB.users;
  }
  // Return mongoose model for User
  return mongoose.models.User || mongoose.model('User', new mongoose.Schema({}));
};

/**
 * Get Company model (real or mock)
 */
export const getCompanyModel = () => {
  if (useMock) {
    return mockDB.companies;
  }
  return mongoose.models.Company || mongoose.model('Company', new mongoose.Schema({}));
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  if (!useMock) {
    await mongoose.disconnect();
  }
};

/**
 * Check if database is connected
 */
export const isConnected = (): boolean => {
  if (useMock) return true;
  return mongoose.connection.readyState === 1;
};

export { mockDB };
