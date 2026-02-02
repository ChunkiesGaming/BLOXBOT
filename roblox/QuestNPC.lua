-- QuestNPC.lua
-- NPC interaction script
-- Place in an NPC model with a ProximityPrompt

local QuestService = require(game.ServerScriptService.QuestService)
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local npc = script.Parent
local prompt = npc:FindFirstChild("ProximityPrompt") or npc:FindFirstChildOfClass("ProximityPrompt")

if not prompt then
	warn("QuestNPC: No ProximityPrompt found on NPC")
	return
end

-- Create RemoteFunction for fetching quest status
local fetchQuestStatus = Instance.new("RemoteFunction")
fetchQuestStatus.Name = "FetchQuestStatus"
fetchQuestStatus.Parent = ReplicatedStorage

-- Handle player interaction
prompt.Triggered:Connect(function(player)
	-- Open quest UI (client will handle this)
	-- The UI will fetch quest status via RemoteFunction
	local success, questData = pcall(function()
		-- This would normally call your backend API
		-- For now, just trigger the UI
		return true
	end)
	
	if success then
		-- Fire client event to open UI
		local openUI = Instance.new("RemoteEvent")
		openUI.Name = "OpenQuestUI"
		openUI.Parent = ReplicatedStorage
		openUI:FireClient(player)
	end
end)

-- RemoteFunction handler for quest status
fetchQuestStatus.OnServerInvoke = function(player)
	-- In production, this would call your backend API
	-- For now, return placeholder
	return {
		activeQuests = {},
		completedQuests = {},
		totalPoints = 0
	}
end
