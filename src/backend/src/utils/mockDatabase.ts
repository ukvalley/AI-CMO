/**
 * Mock Database
 * In-memory storage for development when MongoDB is not available
 */

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  companyIds: string[];
  activeCompanyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockCompany {
  id: string;
  name: string;
  notificationEmail?: string;
  userIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
const users: MockUser[] = [];
const companies: MockCompany[] = [];

// Generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Hash password (simple mock - NOT for production)
const hashPassword = (password: string) => `$2a$10$mock${password}`;
const comparePassword = (password: string, hash: string) => {
  return hash === `$2a$10$mock${password}` || hash === password;
};

export const mockDB = {
  // User operations
  users: {
    findOne: (query: Partial<MockUser>): MockUser | null => {
      const key = Object.keys(query)[0] as keyof MockUser;
      return users.find((u) => u[key] === query[key]) || null;
    },
    find: (query?: { _id?: { $in?: string[] } }): MockUser[] => {
      if (query?._id?.$in) {
        return users.filter((u) => query._id!.$in!.includes(u.id));
      }
      return users;
    },
    findById: (id: string): MockUser | null => {
      return users.find((u) => u.id === id) || null;
    },
    create: (data: Partial<MockUser>): MockUser => {
      const user: MockUser = {
        id: generateId(),
        email: data.email || '',
        passwordHash: data.passwordHash?.startsWith('$2a$')
          ? data.passwordHash
          : hashPassword(data.passwordHash || ''),
        name: data.name || '',
        role: data.role || 'admin',
        companyIds: data.companyIds || [],
        activeCompanyId: data.activeCompanyId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(user);
      return user;
    },
    save: (user: MockUser): MockUser => {
      const index = users.findIndex((u) => u.id === user.id);
      if (index >= 0) {
        users[index] = { ...user, updatedAt: new Date().toISOString() };
      }
      return user;
    },
  },

  // Company operations
  companies: {
    findOne: (query: Partial<MockCompany>): MockCompany | null => {
      const key = Object.keys(query)[0] as keyof MockCompany;
      return companies.find((c) => c[key] === query[key]) || null;
    },
    find: (query?: { _id?: { $in?: string[] } }): MockCompany[] => {
      if (query?._id?.$in) {
        return companies.filter((c) => query._id!.$in!.includes(c.id));
      }
      return companies;
    },
    findById: (id: string): MockCompany | null => {
      return companies.find((c) => c.id === id) || null;
    },
    findByIdAndDelete: (id: string): void => {
      const index = companies.findIndex((c) => c.id === id);
      if (index >= 0) companies.splice(index, 1);
    },
    create: (data: Partial<MockCompany>): MockCompany => {
      const company: MockCompany = {
        id: generateId(),
        name: data.name || '',
        notificationEmail: data.notificationEmail,
        userIds: data.userIds || [],
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      companies.push(company);
      return company;
    },
    save: (company: MockCompany): MockCompany => {
      const index = companies.findIndex((c) => c.id === company.id);
      if (index >= 0) {
        companies[index] = { ...company, updatedAt: new Date().toISOString() };
      }
      return company;
    },
  },

  // Password helpers
  hashPassword,
  comparePassword,
};

export default mockDB;
