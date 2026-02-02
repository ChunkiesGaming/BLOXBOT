-- seed.sql
-- Example quests to get started

-- Insert example quests
INSERT INTO quests (quest_id, name, description, quest_type, target_value, reward_points, cooldown_hours) VALUES
('daily_play_10', 'Play 10 Minutes', 'Play for 10 minutes to earn points', 'time', 600, 50, 24),
('win_2_matches', 'Win 2 Matches', 'Win 2 PvP matches', 'event', 2, 100, 24),
('enter_secret_room', 'Find Secret Room', 'Discover the hidden secret room', 'event', 1, 75, 168),
('collect_25_coins', 'Collect 25 Coins', 'Gather 25 coins in-game', 'stat', 25, 60, 24)
ON CONFLICT (quest_id) DO NOTHING;
