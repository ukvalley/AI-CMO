/**
 * Mengo Backend API
 * Express server with MongoDB and Redis
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { connectDatabase, isMockMode } from './utils/database';
import { connectRedis } from './utils/redis';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Load environment variables — check multiple possible locations
import path from 'path';
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`📄 Loaded .env from: ${envPath}`);
    break;
  }
}

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3101;

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server, path: '/ws' });

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3100',
    'http://localhost:3100',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
  ],
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: isMockMode() ? 'mock' : 'mongodb',
    timestamp: new Date().toISOString()
  });
});

// Load routes after database connection
const loadRoutes = () => {
  // Import routes (models will be loaded dynamically based on mock mode)
  const authRoutes = require('./routes/auth').default;
  const companyRoutes = require('./routes/companies').default;
  const userRoutes = require('./routes/users').default;
  const businessProfileRoutes = require('./routes/businessProfiles').default;
  const productRoutes = require('./routes/products').default;
  const founderRoutes = require('./routes/founders').default;
  const employeeRoutes = require('./routes/employees').default;
  const icpRoutes = require('./routes/icps').default;
  const personaRoutes = require('./routes/personas').default;
  const competitorRoutes = require('./routes/competitors').default;
  const brandRoutes = require('./routes/brands').default;
  const brandAssetRoutes = require('./routes/brandAssets').default;
  const stationeryRoutes = require('./routes/stationery').default;
  const hrAssetRoutes = require('./routes/hrAssets').default;
  const websitePageRoutes = require('./routes/websitePages').default;
  const blogRoutes = require('./routes/blogs').default;
  const blogContentOsRoutes = require('./routes/blogContentOs').default;
  const newsletterRoutes = require('./routes/newsletters').default;
  const faqRoutes = require('./routes/faqs').default;
  const moduleDataRoutes = require('./routes/moduleData').default;
  const chatRoutes = require('./routes/chat').default;
  const taskRoutes = require('./routes/tasks').default;
  const aiRoutes = require('./routes/ai').default;
  const uploadRoutes = require('./routes/upload').default;

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/business-profiles', businessProfileRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/founders', founderRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/icps', icpRoutes);
  app.use('/api/personas', personaRoutes);
  app.use('/api/competitors', competitorRoutes);
  app.use('/api/brands', brandRoutes);
  app.use('/api/brand-assets', brandAssetRoutes);
  app.use('/api/stationery', stationeryRoutes);
  app.use('/api/hr-assets', hrAssetRoutes);
  app.use('/api/website-pages', websitePageRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/blog-content-os', blogContentOsRoutes);
  app.use('/api/newsletters', newsletterRoutes);
  app.use('/api/faqs', faqRoutes);
  app.use('/api/module-data', moduleDataRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/ai', aiRoutes);

  // Error handling
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Handle different message types
      if (data.type === 'subscribe' && data.companyId) {
        // Subscribe to company-specific updates
        (ws as any).companyId = data.companyId;
        ws.send(JSON.stringify({ type: 'subscribed', companyId: data.companyId }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Broadcast function for real-time updates
export const broadcastToCompany = (companyId: string, data: any) => {
  wss.clients.forEach((client: any) => {
    if (client.companyId === companyId && client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB (or use mock)
    await connectDatabase();
    console.log(isMockMode() ? '📦 Using in-memory mock database' : '✅ MongoDB connected');

    // Connect to Redis (optional — won't block startup)
    await connectRedis();

    // Load routes after database connection
    loadRoutes();

    // Load routes after database connection
    loadRoutes();

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready on ws://localhost:${PORT}/ws`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
