-- PlaytimeQuest.lua
-- Example: Track playtime for daily quest
-- Place in ServerScriptService

local QuestService = require(script.Parent.QuestService)

-- Report playtime every 30 seconds
local REPORT_INTERVAL = 30

while true do
	task.wait(REPORT_INTERVAL)
	
	for _, player in ipairs(game.Players:GetPlayers()) do
		-- Report 30 seconds of playtime
		QuestService:ReportTimeProgress(player, "daily_play_10", REPORT_INTERVAL)
	end
end
