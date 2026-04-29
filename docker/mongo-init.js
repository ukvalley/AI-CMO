// MongoDB Initialization Script
// This script runs when MongoDB container starts for the first time

db = db.getSiblingDB('ai_cmo');

// Create collections with validation
// Companies Collection
db.createCollection('companies', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'isActive', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        notificationEmail: { bsonType: 'string' },
        userIds: { bsonType: 'array', items: { bsonType: 'string' } },
        isActive: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Users Collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'role', 'companyIds', 'createdAt', 'updatedAt'],
      properties: {
        email: { bsonType: 'string' },
        name: { bsonType: 'string' },
        role: { enum: ['admin', 'editor', 'viewer'] },
        companyIds: { bsonType: 'array', items: { bsonType: 'string' } },
        activeCompanyId: { bsonType: ['string', 'null'] },
        avatar: { bsonType: 'string' },
        passwordHash: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Business Profiles Collection
db.createCollection('businessProfiles', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'stage', 'industries', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        startDate: { bsonType: ['string', 'null'] },
        stage: { bsonType: 'string' },
        industries: { bsonType: 'array', items: { bsonType: 'string' } },
        description: { bsonType: 'string' },
        mission: { bsonType: 'string' },
        vision: { bsonType: 'string' },
        coreValues: { bsonType: 'string' },
        usp: { bsonType: 'string' },
        funding: { bsonType: 'string' },
        revenue: { bsonType: 'string' },
        teamSize: { bsonType: 'int' },
        isRevenuePublic: { bsonType: 'bool' },
        isFounderPublic: { bsonType: 'bool' },
        address: { bsonType: 'string' },
        city: { bsonType: 'string' },
        country: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        email: { bsonType: 'string' },
        website: { bsonType: 'string' },
        socialProfiles: { bsonType: 'object' },
        mapLinks: { bsonType: 'object' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Products Collection
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'categoryId', 'status', 'audienceType', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        categoryId: { bsonType: 'string' },
        price: { bsonType: ['number', 'null'] },
        status: { enum: ['active', 'draft', 'discontinued'] },
        audienceType: { enum: ['b2b', 'b2c', 'both'] },
        usp: { bsonType: 'string' },
        description: { bsonType: 'string' },
        features: { bsonType: 'array', items: { bsonType: 'string' } },
        icpIds: { bsonType: 'array', items: { bsonType: 'string' } },
        personaIds: { bsonType: 'array', items: { bsonType: 'string' } },
        marketingCopy: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Product Categories Collection
db.createCollection('productCategories', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        description: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Founders Collection
db.createCollection('founders', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        title: { bsonType: 'string' },
        email: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        city: { bsonType: 'string' },
        country: { bsonType: 'string' },
        dateOfBirth: { bsonType: 'string' },
        workAnniversary: { bsonType: 'string' },
        expertise: { bsonType: 'array', items: { bsonType: 'string' } },
        responsibilityArea: { bsonType: 'string' },
        bio: { bsonType: 'string' },
        socialProfiles: { bsonType: 'object' },
        assets: { bsonType: 'array' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Employees Collection
db.createCollection('employees', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        title: { bsonType: 'string' },
        department: { bsonType: 'string' },
        level: { bsonType: 'string' },
        email: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        city: { bsonType: 'string' },
        country: { bsonType: 'string' },
        dateOfBirth: { bsonType: 'string' },
        workAnniversary: { bsonType: 'string' },
        expertise: { bsonType: 'array', items: { bsonType: 'string' } },
        responsibilityArea: { bsonType: 'string' },
        reportsTo: { bsonType: 'string' },
        bio: { bsonType: 'string' },
        socialProfiles: { bsonType: 'object' },
        assets: { bsonType: 'array' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// ICPs Collection
db.createCollection('icps', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'isActive', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        description: { bsonType: 'string' },
        isActive: { bsonType: 'bool' },
        industry: { bsonType: 'string' },
        companySize: { bsonType: 'string' },
        location: { bsonType: 'string' },
        painPoints: { bsonType: 'array', items: { bsonType: 'string' } },
        goals: { bsonType: 'array', items: { bsonType: 'string' } },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Personas Collection
db.createCollection('personas', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'icpId', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        icpId: { bsonType: 'string' },
        age: { bsonType: 'string' },
        job: { bsonType: 'string' },
        goals: { bsonType: 'array', items: { bsonType: 'string' } },
        painPoints: { bsonType: 'array', items: { bsonType: 'string' } },
        bio: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Competitors Collection
db.createCollection('competitors', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'threatLevel', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        website: { bsonType: 'string' },
        threatLevel: { enum: ['low', 'medium', 'high', 'critical'] },
        usp: { bsonType: 'string' },
        strengths: { bsonType: 'string' },
        weaknesses: { bsonType: 'string' },
        swot: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Generic Module Data Collection (for dynamic modules)
db.createCollection('moduleData', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['moduleId', 'companyId', 'data', 'createdAt', 'updatedAt'],
      properties: {
        moduleId: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        data: { bsonType: 'object' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Chat Sessions Collection
db.createCollection('chatSessions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['companyId', 'messages', 'createdAt', 'updatedAt'],
      properties: {
        companyId: { bsonType: 'string' },
        userId: { bsonType: 'string' },
        messages: { bsonType: 'array' },
        context: { bsonType: 'object' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Background Tasks Collection
db.createCollection('backgroundTasks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'moduleId', 'status', 'totalItems', 'completedItems', 'companyId', 'createdAt', 'updatedAt'],
      properties: {
        name: { bsonType: 'string' },
        companyId: { bsonType: 'string' },
        moduleId: { bsonType: 'string' },
        totalItems: { bsonType: 'int' },
        completedItems: { bsonType: 'int' },
        status: { enum: ['running', 'completed', 'failed', 'cancelled'] },
        results: { bsonType: 'array' },
        error: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create indexes for common queries
db.companies.createIndex({ userIds: 1 });
db.companies.createIndex({ isActive: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ companyIds: 1 });
db.businessProfiles.createIndex({ companyId: 1 }, { unique: true });
db.products.createIndex({ companyId: 1, categoryId: 1 });
db.productCategories.createIndex({ companyId: 1 });
db.founders.createIndex({ companyId: 1 });
db.employees.createIndex({ companyId: 1 });
db.employees.createIndex({ companyId: 1, department: 1 });
db.icps.createIndex({ companyId: 1 });
db.personas.createIndex({ companyId: 1, icpId: 1 });
db.competitors.createIndex({ companyId: 1 });
db.moduleData.createIndex({ moduleId: 1, companyId: 1 });
db.chatSessions.createIndex({ companyId: 1 });
db.backgroundTasks.createIndex({ companyId: 1, status: 1 });

// Insert default admin user (password should be hashed in production)
// Note: In production, use proper password hashing
db.users.insertOne({
  email: 'admin@aicmo.com',
  name: 'Admin User',
  role: 'admin',
  companyIds: [],
  activeCompanyId: null,
  passwordHash: '$2a$10$YourHashedPasswordHere', // bcrypt hash of 'admin123'
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialized successfully with AI CMO schema');
