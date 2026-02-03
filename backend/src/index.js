// src/index.js
// Main Express server entry point

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import eventRoutes from './routes/events.js';
import questRoutes from './routes/quests.js';
import userRoutes from './routes/users.js';
import claimRoutes from './routes/claims.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
	origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
	credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
	next();
});

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/quests', questRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/claims', claimRoutes);
app.use('/api/v1/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
	console.error('Error:', err);
	res.status(err.status || 500).json({
		error: err.message || 'Internal server error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Quest Layer Backend running on port ${PORT}`);
	console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
