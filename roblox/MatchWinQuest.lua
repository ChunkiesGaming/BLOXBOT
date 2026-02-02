-- MatchWinQuest.lua
-- Example: Track match wins for PvP quests
-- Place in ServerScriptService and connect to your match system

local QuestService = require(script.Parent.QuestService)

-- Example: Connect to your match end event
-- Replace this with your actual match system
local function onMatchEnd(winner)
	if winner and winner:IsA("Player") then
		QuestService:ReportEventProgress(winner, "win_2_matches", 1)
	end
end

-- Example usage with RemoteEvent (if you have a match system)
-- game.ReplicatedStorage.MatchEnded.OnServerEvent:Connect(onMatchEnd)

return {
	onMatchEnd = onMatchEnd
}
