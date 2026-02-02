-- schema.sql
-- Database schema for Quest Layer

-- Users table (Roblox users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    roblox_user_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    wallet_address VARCHAR(255), -- Solana wallet (optional, for future)
    total_points BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_roblox_id ON users(roblox_user_id);
CREATE INDEX idx_users_wallet ON users(wallet_address);

-- Quests table
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    quest_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quest_type VARCHAR(50) NOT NULL, -- 'time', 'event', 'stat'
    target_value BIGINT NOT NULL,
    reward_points BIGINT NOT NULL,
    cooldown_hours INTEGER DEFAULT 24,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quests_quest_id ON quests(quest_id);
CREATE INDEX idx_quests_active ON quests(active);

-- Quest progress table
CREATE TABLE IF NOT EXISTS quest_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    current_value BIGINT DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    last_progress_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quest_id)
);

CREATE INDEX idx_progress_user_quest ON quest_progress(user_id, quest_id);
CREATE INDEX idx_progress_completed ON quest_progress(completed);

-- Quest events table (audit log)
CREATE TABLE IF NOT EXISTS quest_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    server_id VARCHAR(255),
    server_time BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_user ON quest_events(user_id);
CREATE INDEX idx_events_quest ON quest_events(quest_id);
CREATE INDEX idx_events_created ON quest_events(created_at);

-- Claims table (for future Solana integration)
CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    claim_id VARCHAR(255) UNIQUE NOT NULL,
    reward_type VARCHAR(50) NOT NULL, -- 'points', 'nft', 'token'
    reward_amount BIGINT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'claimed', 'expired'
    merkle_proof JSONB,
    claimed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claims_user ON claims(user_id);
CREATE INDEX idx_claims_claim_id ON claims(claim_id);
CREATE INDEX idx_claims_status ON claims(status);

-- Points transactions table (audit log)
CREATE TABLE IF NOT EXISTS points_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id),
    amount BIGINT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'spent', 'adjusted'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON points_transactions(user_id);
CREATE INDEX idx_transactions_created ON points_transactions(created_at);

-- Sessions table (for anti-cheat)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    server_id VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    total_time INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_active ON sessions(is_active);
