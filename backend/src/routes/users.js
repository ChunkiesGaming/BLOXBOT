// src/routes/users.js
// User management routes

import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../db/connection.js';

const router = express.Router();

// POST /api/v1/users/link-wallet
// Link Solana wallet to Roblox user
router.post('/link-wallet', verifyToken, async (req, res) => {
	try {
		const { walletAddress } = req.body;
		const robloxUserId = req.user.robloxUserId;
		
		if (!walletAddress) {
			return res.status(400).json({ error: 'Wallet address required' });
		}
		
		// Update user wallet
		const result = await pool.query(
			`UPDATE users 
			 SET wallet_address = $1, updated_at = CURRENT_TIMESTAMP
			 WHERE roblox_user_id = $2
			 RETURNING *`,
			[walletAddress, robloxUserId]
		);
		
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'User not found' });
		}
		
		res.json({
			success: true,
			user: result.rows[0]
		});
	} catch (error) {
		console.error('Error linking wallet:', error);
		res.status(500).json({ 
			error: 'Failed to link wallet',
			message: error.message 
		});
	}
});

// GET /api/v1/users/me
// Get current user info
router.get('/me', verifyToken, async (req, res) => {
	try {
		const robloxUserId = req.user.robloxUserId;
		
		const result = await pool.query(
			`SELECT roblox_user_id, username, wallet_address, total_points, created_at
			 FROM users WHERE roblox_user_id = $1`,
			[robloxUserId]
		);
		
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'User not found' });
		}
		
		res.json({
			success: true,
			user: result.rows[0]
		});
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({ 
			error: 'Failed to fetch user',
			message: error.message 
		});
	}
});

export default router;
