-- QuestService.lua
-- Server-side authoritative quest tracking service
-- Place in ServerScriptService

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

local QuestService = {}

-- Configuration
local API_URL = os.getenv("BACKEND_API_URL") or "http://localhost:3000/api/v1/events"
local API_KEY = os.getenv("ROBLOX_API_KEY") or "YOUR_SERVER_SECRET_KEY"

-- In-memory session tracking
local sessions = {}

-- Initialize player session on join
Players.PlayerAdded:Connect(function(player)
	sessions[player.UserId] = {
		joinedAt = os.time(),
		lastPing = os.time(),
		activeQuests = {}
	}
	
	-- Notify backend of player join
	QuestService:SendEvent(player, "player_joined", {
		timestamp = os.time()
	})
end)

-- Cleanup on player leave
Players.PlayerRemoving:Connect(function(player)
	if sessions[player.UserId] then
		-- Send final session data
		local sessionTime = os.time() - sessions[player.UserId].joinedAt
		QuestService:SendEvent(player, "player_left", {
			sessionTime = sessionTime,
			timestamp = os.time()
		})
		
		sessions[player.UserId] = nil
	end
end)

-- Main event reporting function
function QuestService:SendEvent(player, questId, data)
	if not player or not player.Parent then return end
	if not sessions[player.UserId] then return end
	
	local payload = {
		robloxUserId = tostring(player.UserId),
		questId = questId,
		data = data or {},
		serverTime = os.time(),
		serverId = game.JobId
	}
	
	-- Update last ping
	sessions[player.UserId].lastPing = os.time()
	
	-- Send to backend (async, non-blocking)
	spawn(function()
		local success, result = pcall(function()
			return HttpService:PostAsync(
				API_URL,
				HttpService:JSONEncode(payload),
				Enum.HttpContentType.ApplicationJson,
				false,
				{
					["x-api-key"] = API_KEY,
					["Content-Type"] = "application/json"
				}
			)
		end)
		
		if not success then
			warn("QuestService: Failed to send event - " .. tostring(result))
		end
	end)
end

-- Helper: Report time-based progress
function QuestService:ReportTimeProgress(player, questId, seconds)
	QuestService:SendEvent(player, questId, {
		type = "time",
		delta = seconds
	})
end

-- Helper: Report event-based progress
function QuestService:ReportEventProgress(player, questId, value)
	QuestService:SendEvent(player, questId, {
		type = "event",
		value = value or 1
	})
end

-- Helper: Report stat-based progress
function QuestService:ReportStatProgress(player, questId, statName, statValue)
	QuestService:SendEvent(player, questId, {
		type = "stat",
		statName = statName,
		statValue = statValue
	})
end

return QuestService
