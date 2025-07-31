const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const searchRoutes = require('../src/routes/search');
const movieRoutes = require('../src/routes/movie');
const seriesRoutes = require('../src/routes/series');
const streamRoutes = require('../src/routes/stream');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' });
  }
});

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/stream', streamRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Lampa Ukraine Parser API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      search: '/api/search?query=название',
      movie: '/api/movie/:id?source=filmix',
      series: '/api/series/:id?source=filmix',
      stream: '/api/stream/:id?source=filmix'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app; 