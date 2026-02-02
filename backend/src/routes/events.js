// src/routes/events.js
// Handle quest events from Roblox servers

import express from 'express';
import { verifyRobloxServer } from '../middleware/auth.js';
import { handleQuestEvent } from '../services/questService.js';

const router = express.Router();

// All routes require Roblox server authentication
router.use(verifyRobloxServer);

// POST /api/v1/events
// Receive quest events from Roblox
router.post('/', async (req, res) => {
	try {
		const { robloxUserId, questId, data, serverTime, serverId } = req.body;
		
		if (!robloxUserId || !questId) {
			return res.status(400).json({ 
				error: 'Missing required fields: robloxUserId, questId' 
			});
		}
		
		// Process the event
		const result = await handleQuestEvent({
			robloxUserId: String(robloxUserId),
			questId,
			data: data || {},
			serverTime,
			serverId
		});
		
		res.json({
			success: true,
			...result
		});
	} catch (error) {
		console.error('Event processing error:', error);
		res.status(500).json({ 
			error: 'Failed to process event',
			message: error.message 
		});
	}
});

export default router;
