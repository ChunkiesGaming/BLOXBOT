// src/routes/quests.js
// Quest management routes

import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getUserQuests, getUserPoints } from '../services/questService.js';

const router = express.Router();

// GET /api/v1/quests/user/:robloxUserId
// Get all quests for a user
router.get('/user/:robloxUserId', async (req, res) => {
	try {
		const { robloxUserId } = req.params;
		const quests = await getUserQuests(robloxUserId);
		
		res.json({
			success: true,
			quests
		});
	} catch (error) {
		console.error('Error fetching user quests:', error);
		res.status(500).json({ 
			error: 'Failed to fetch quests',
			message: error.message 
		});
	}
});

// GET /api/v1/quests/points/:robloxUserId
// Get user's total points
router.get('/points/:robloxUserId', async (req, res) => {
	try {
		const { robloxUserId } = req.params;
		const points = await getUserPoints(robloxUserId);
		
		res.json({
			success: true,
			points
		});
	} catch (error) {
		console.error('Error fetching user points:', error);
		res.status(500).json({ 
			error: 'Failed to fetch points',
			message: error.message 
		});
	}
});

export default router;
