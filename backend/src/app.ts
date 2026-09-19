import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { ENV } from './config/env.js';

const app = express();

// Middleware
app.use(cors({
  origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Root Welcome & Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'KrishiSmart AI Backend REST API',
    message: 'KrishiSmart AI backend service is running successfully.',
    health: '/health',
    api: '/api',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KrishiSmart AI Backend API',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', routes);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
