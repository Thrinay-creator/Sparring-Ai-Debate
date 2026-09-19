import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health.js';
import debateRouter from './routes/debate.js';
import feedbackRouter from './routes/feedback.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (origin === CLIENT_URL || origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173') {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from ${origin}`));
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '1mb' }));

// Rate limiter on /api
app.use('/api', apiRateLimiter);

// API Routes
app.use('/api', healthRouter);
app.use('/api', debateRouter);
app.use('/api', feedbackRouter);

// Global Error Handler
app.use(errorHandler);

// Start server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Sparring Backend] Chamber server listening on port ${PORT}`);
    console.log(`[Sparring Backend] Client URL configured as: ${CLIENT_URL}`);
  });
}

export default app;
