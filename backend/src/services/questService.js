// src/services/questService.js
// Core quest processing logic

import pool from '../db/connection.js';
import crypto from 'crypto';

// Get or create user
async function getOrCreateUser(robloxUserId) {
	const result = await pool.query(
		'SELECT * FROM users WHERE roblox_user_id = $1',
		[robloxUserId]
	);
	
	if (result.rows.length > 0) {
		return result.rows[0];
	}
	
	// Create new user
	const insertResult = await pool.query(
		`INSERT INTO users (roblox_user_id) 
		 VALUES ($1) 
		 RETURNING *`,
		[robloxUserId]
	);
	
	return insertResult.rows[0];
}

// Get quest by quest_id
async function getQuest(questId) {
	const result = await pool.query(
		'SELECT * FROM quests WHERE quest_id = $1 AND active = true',
		[questId]
	);
	
	return result.rows[0] || null;
}

// Get or create quest progress
async function getOrCreateProgress(userId, questId) {
	const result = await pool.query(
		`SELECT * FROM quest_progress 
		 WHERE user_id = $1 AND quest_id = $2`,
		[userId, questId]
	);
	
	if (result.rows.length > 0) {
		return result.rows[0];
	}
	
	// Create new progress
	const insertResult = await pool.query(
		`INSERT INTO quest_progress (user_id, quest_id, current_value) 
		 VALUES ($1, $2, 0) 
		 RETURNING *`,
		[userId, questId]
	);
	
	return insertResult.rows[0];
}

// Check cooldown
async function checkCooldown(userId, questId, cooldownHours) {
	const result = await pool.query(
		`SELECT completed_at FROM quest_progress 
		 WHERE user_id = $1 AND quest_id = $2 AND completed = true
		 ORDER BY completed_at DESC LIMIT 1`,
		[userId, questId]
	);
	
	if (result.rows.length === 0) {
		return true; // No previous completion
	}
	
	const lastCompleted = new Date(result.rows[0].completed_at);
	const cooldownMs = cooldownHours * 60 * 60 * 1000;
	const now = new Date();
	
	return (now - lastCompleted) >= cooldownMs;
}

// Update progress
async function updateProgress(progressId, newValue, targetValue) {
	const isComplete = newValue >= targetValue;
	
	const result = await pool.query(
		`UPDATE quest_progress 
		 SET current_value = $1, 
		     completed = $2,
		     completed_at = CASE WHEN $2 = true AND completed_at IS NULL THEN CURRENT_TIMESTAMP ELSE completed_at END,
		     last_progress_at = CURRENT_TIMESTAMP
		 WHERE id = $3
		 RETURNING *`,
		[newValue, isComplete, progressId]
	);
	
	return result.rows[0];
}

// Award points
async function awardPoints(userId, questId, points) {
	// Update user total
	await pool.query(
		`UPDATE users 
		 SET total_points = total_points + $1,
		     updated_at = CURRENT_TIMESTAMP
		 WHERE id = $2`,
		[points, userId]
	);
	
	// Log transaction
	await pool.query(
		`INSERT INTO points_transactions (user_id, quest_id, amount, transaction_type, description)
		 VALUES ($1, $2, $3, 'earned', 'Quest completion reward')`,
		[userId, questId, points]
	);
}

// Log event
async function logEvent(userId, questId, eventType, eventData, serverId, serverTime) {
	await pool.query(
		`INSERT INTO quest_events (user_id, quest_id, event_type, event_data, server_id, server_time)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		[userId, questId, eventType, JSON.stringify(eventData), serverId, serverTime]
	);
}

// Main event handler
export async function handleQuestEvent({ robloxUserId, questId, data, serverTime, serverId }) {
	// Get or create user
	const user = await getOrCreateUser(robloxUserId);
	
	// Get quest
	const quest = await getQuest(questId);
	if (!quest) {
		return { 
			success: false, 
			error: 'Quest not found or inactive' 
		};
	}
	
	// Get or create progress
	const progress = await getOrCreateProgress(user.id, quest.id);
	
	// Check if already completed and cooldown
	if (progress.completed) {
		const canRetry = await checkCooldown(user.id, quest.id, quest.cooldown_hours);
		if (!canRetry) {
			return {
				success: true,
				message: 'Quest on cooldown',
				completed: true,
				cooldown: true
			};
		}
		// Reset progress for new attempt
		await pool.query(
			`UPDATE quest_progress 
			 SET completed = false, current_value = 0, completed_at = NULL
			 WHERE id = $1`,
			[progress.id]
		);
		progress.completed = false;
		progress.current_value = 0;
	}
	
	// Calculate new progress based on quest type
	let newValue = progress.current_value;
	
	if (quest.quest_type === 'time') {
		newValue += data.delta || 0;
	} else if (quest.quest_type === 'event') {
		newValue += data.value || 1;
	} else if (quest.quest_type === 'stat') {
		newValue = data.statValue || newValue;
	}
	
	// Cap at target
	newValue = Math.min(newValue, quest.target_value);
	
	// Update progress
	const updatedProgress = await updateProgress(progress.id, newValue, quest.target_value);
	
	// Check if just completed
	const justCompleted = updatedProgress.completed && !progress.completed;
	
	if (justCompleted) {
		// Award points
		await awardPoints(user.id, quest.id, quest.reward_points);
		
		// Create claim record
		const claimId = crypto.randomBytes(32).toString('hex');
		await pool.query(
			`INSERT INTO claims (user_id, quest_id, claim_id, reward_type, reward_amount, status)
			 VALUES ($1, $2, $3, 'points', $4, 'pending')`,
			[user.id, quest.id, claimId, quest.reward_points]
		);
	}
	
	// Log event
	await logEvent(user.id, quest.id, 'progress', data, serverId, serverTime);
	
	return {
		success: true,
		progress: updatedProgress.current_value,
		target: quest.target_value,
		completed: updatedProgress.completed,
		pointsAwarded: justCompleted ? quest.reward_points : 0,
		claimId: justCompleted ? claimId : null
	};
}

// Get user quests
export async function getUserQuests(robloxUserId) {
	const user = await getOrCreateUser(robloxUserId);
	
	const result = await pool.query(
		`SELECT 
			q.quest_id,
			q.name,
			q.description,
			q.quest_type,
			q.target_value,
			q.reward_points,
			COALESCE(p.current_value, 0) as current_value,
			COALESCE(p.completed, false) as completed,
			p.completed_at
		FROM quests q
		LEFT JOIN quest_progress p ON q.id = p.quest_id AND p.user_id = $1
		WHERE q.active = true
		ORDER BY q.id`,
		[user.id]
	);
	
	return result.rows;
}

// Get user points
export async function getUserPoints(robloxUserId) {
	const user = await getOrCreateUser(robloxUserId);
	
	const result = await pool.query(
		`SELECT total_points FROM users WHERE id = $1`,
		[user.id]
	);
	
	return result.rows[0]?.total_points || 0;
}
