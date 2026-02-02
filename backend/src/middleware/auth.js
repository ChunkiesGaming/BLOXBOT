// src/middleware/auth.js
// Authentication middleware for API requests

import jwt from 'jsonwebtoken';

// Verify Roblox server API key
export const verifyRobloxServer = (req, res, next) => {
	const apiKey = req.headers['x-api-key'];
	
	if (!apiKey) {
		return res.status(401).json({ error: 'Missing API key' });
	}
	
	if (apiKey !== process.env.ROBLOX_API_KEY) {
		return res.status(403).json({ error: 'Invalid API key' });
	}
	
	next();
};

// Verify JWT token (for web app)
export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	
	if (!token) {
		return res.status(401).json({ error: 'No token provided' });
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({ error: 'Invalid token' });
	}
};
