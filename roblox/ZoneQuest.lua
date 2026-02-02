-- ZoneQuest.lua
-- Example: Track zone/area entry quests
-- Place a Part with this script as a child in your game

local QuestService = require(game.ServerScriptService.QuestService)

local zone = script.Parent -- The Part that represents the zone

zone.Touched:Connect(function(hit)
	local character = hit.Parent
	local humanoid = character:FindFirstChild("Humanoid")
	local player = game.Players:GetPlayerFromCharacter(character)
	
	if not player or not humanoid then return end
	
	-- Report zone entry
	QuestService:ReportEventProgress(player, "enter_secret_room", 1)
	
	-- Optional: Prevent multiple triggers
	wait(5) -- Cooldown
end)
