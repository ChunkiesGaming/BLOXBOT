// src/routes/auth.js
// Authentication routes (Roblox OAuth)

import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import pool from '../db/connection.js';

const router = express.Router();

// GET /api/v1/auth/roblox/callback
// Roblox OAuth callback
router.get('/roblox/callback', async (req, res) => {
	try {
		const { code } = req.query;
		
		if (!code) {
			return res.status(400).json({ error: 'Missing authorization code' });
		}
		
		// Exchange code for access token
		const tokenResponse = await axios.post('https://apis.roblox.com/oauth/v1/token', {
			client_id: process.env.ROBLOX_CLIENT_ID,
			client_secret: process.env.ROBLOX_CLIENT_SECRET,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: process.env.ROBLOX_REDIRECT_URI
		}, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
		
		const { access_token } = tokenResponse.data;
		
		// Get user info from Roblox
		const userResponse = await axios.get('https://users.roblox.com/v1/users/authenticated', {
			headers: { 'Authorization': `Bearer ${access_token}` }
		});
		
		const robloxUser = userResponse.data;
		
		// Get or create user in database
		const userResult = await pool.query(
			`SELECT * FROM users WHERE roblox_user_id = $1`,
			[String(robloxUser.id)]
		);
		
		let user;
		if (userResult.rows.length === 0) {
			const insertResult = await pool.query(
				`INSERT INTO users (roblox_user_id, username) 
				 VALUES ($1, $2) 
				 RETURNING *`,
				[String(robloxUser.id), robloxUser.name]
			);
			user = insertResult.rows[0];
		} else {
			// Update username
			await pool.query(
				`UPDATE users SET username = $1 WHERE roblox_user_id = $2`,
				[robloxUser.name, String(robloxUser.id)]
			);
			user = userResult.rows[0];
		}
		
		// Generate JWT
		const token = jwt.sign(
			{ 
				robloxUserId: String(robloxUser.id),
				username: robloxUser.name
			},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		);
		
		// Redirect to frontend with token (encode token so URL is safe)
		const frontendUrl = (process.env.CORS_ORIGIN || 'http://localhost:3000').replace(/\/$/, '');
		res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
		
	} catch (error) {
		console.error('OAuth error:', error);
		const frontendUrl = (process.env.CORS_ORIGIN || 'http://localhost:3000').replace(/\/$/, '');
		res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(error.message || 'OAuth failed')}`);
	}
});

// GET /api/v1/auth/roblox/login
// Initiate Roblox OAuth
router.get('/roblox/login', (req, res) => {
	const clientId = process.env.ROBLOX_CLIENT_ID;
	const redirectUri = encodeURIComponent(process.env.ROBLOX_REDIRECT_URI);
	const scope = 'openid profile';
	
	const authUrl = `https://authorize.roblox.com/v1/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=Code&scope=${scope}`;
	
	res.redirect(authUrl);
});

export default router;
