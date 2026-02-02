// src/routes/claims.js
// Claim management routes

import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../db/connection.js';

const router = express.Router();

// GET /api/v1/claims/pending/:robloxUserId
// Get pending claims for a user
router.get('/pending/:robloxUserId', verifyToken, async (req, res) => {
	try {
		const { robloxUserId } = req.params;
		
		// Verify user owns this request
		if (req.user.robloxUserId !== robloxUserId) {
			return res.status(403).json({ error: 'Unauthorized' });
		}
		
		const result = await pool.query(
			`SELECT 
				c.claim_id,
				c.reward_type,
				c.reward_amount,
				c.status,
				c.created_at,
				q.name as quest_name,
				q.description as quest_description
			FROM claims c
			JOIN users u ON c.user_id = u.id
			JOIN quests q ON c.quest_id = q.id
			WHERE u.roblox_user_id = $1 AND c.status = 'pending'
			ORDER BY c.created_at DESC`,
			[robloxUserId]
		);
		
		res.json({
			success: true,
			claims: result.rows
		});
	} catch (error) {
		console.error('Error fetching claims:', error);
		res.status(500).json({ 
			error: 'Failed to fetch claims',
			message: error.message 
		});
	}
});

// POST /api/v1/claims/claim/:claimId
// Mark a claim as claimed (for future Solana integration)
router.post('/claim/:claimId', verifyToken, async (req, res) => {
	try {
		const { claimId } = req.params;
		const robloxUserId = req.user.robloxUserId;
		
		// Verify claim belongs to user
		const checkResult = await pool.query(
			`SELECT c.id, c.status 
			 FROM claims c
			 JOIN users u ON c.user_id = u.id
			 WHERE c.claim_id = $1 AND u.roblox_user_id = $2`,
			[claimId, robloxUserId]
		);
		
		if (checkResult.rows.length === 0) {
			return res.status(404).json({ error: 'Claim not found' });
		}
		
		if (checkResult.rows[0].status !== 'pending') {
			return res.status(400).json({ error: 'Claim already processed' });
		}
		
		// Update claim status
		const result = await pool.query(
			`UPDATE claims 
			 SET status = 'claimed', claimed_at = CURRENT_TIMESTAMP
			 WHERE claim_id = $1
			 RETURNING *`,
			[claimId]
		);
		
		res.json({
			success: true,
			claim: result.rows[0]
		});
	} catch (error) {
		console.error('Error claiming reward:', error);
		res.status(500).json({ 
			error: 'Failed to claim reward',
			message: error.message 
		});
	}
});

export default router;
