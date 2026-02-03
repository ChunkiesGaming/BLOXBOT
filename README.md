# Quest Layer - Roblox Quest-to-Earn System

A complete Quest-to-Earn system that connects Roblox gameplay with Solana rewards. Players complete quests in Roblox games and earn points that can be claimed through a web interface.

## 🏗️ Architecture

```
[Roblox Game] → [Backend API] → [Database] → [Web App] → [Solana Wallet]
```

- **Roblox**: Server-side quest tracking (Lua scripts)
- **Backend**: Node.js/Express API with PostgreSQL
- **Web App**: Next.js frontend with Solana wallet integration
- **Database**: PostgreSQL for quests, users, points, and claims

## 📁 Project Structure

```
.
├── roblox/              # Roblox Lua scripts
│   ├── QuestService.lua
│   ├── PlaytimeQuest.lua
│   ├── ZoneQuest.lua
│   ├── MatchWinQuest.lua
│   └── QuestNPC.lua
├── backend/              # Node.js API
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── db/
│   ├── package.json
│   └── .env.example
├── web/                # Next.js frontend
│   ├── app/
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Roblox Studio (for testing Lua scripts)

### 1. Database Setup

```bash
# Create database
createdb questlayer

# Run schema
psql questlayer < backend/src/db/schema.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend runs on `http://localhost:4000`

### 3. Web App Setup

```bash
cd web
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Web app runs on `http://localhost:3000`

### 4. Roblox Setup

1. Open your Roblox game in Roblox Studio
2. Place all Lua scripts from `roblox/` into `ServerScriptService`
3. Update `QuestService.lua` with your backend API URL and API key
4. Configure quests in your database

## 🔧 Configuration

### Backend Environment Variables

- `PORT`: Server port (default: 4000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens
- `ROBLOX_API_KEY`: Secret key for Roblox server authentication
- `ROBLOX_CLIENT_ID`: Roblox OAuth client ID
- `ROBLOX_CLIENT_SECRET`: Roblox OAuth client secret
- `ROBLOX_REDIRECT_URI`: OAuth callback URL
- `CORS_ORIGIN`: Frontend URL

### Roblox Configuration

Update `QuestService.lua`:
```lua
local API_URL = "https://your-backend.xyz/api/v1/events"
local API_KEY = "your-secret-key"
```

## 📊 Database Schema

- **users**: Roblox users and their points
- **quests**: Quest definitions
- **quest_progress**: User progress on quests
- **quest_events**: Event audit log
- **claims**: Reward claims (for future Solana integration)
- **points_transactions**: Points transaction history
- **sessions**: Player session tracking

## 🎮 Quest Types

1. **Time-based**: Track playtime (e.g., "Play 10 minutes")
2. **Event-based**: Track specific events (e.g., "Win 2 matches")
3. **Stat-based**: Track game statistics (e.g., "Collect 25 coins")

## 🔐 Security Features

- Server-side only quest tracking (no client trust)
- API key authentication for Roblox servers
- JWT authentication for web app
- Anti-cheat measures (cooldowns, session validation)
- Rate limiting ready

## 🎯 Usage

### Creating Quests

Insert into `quests` table:
```sql
INSERT INTO quests (quest_id, name, description, quest_type, target_value, reward_points, cooldown_hours)
VALUES ('daily_play_10', 'Play 10 Minutes', 'Play for 10 minutes to earn points', 'time', 600, 50, 24);
```

### Tracking Events

In your Roblox game:
```lua
local QuestService = require(game.ServerScriptService.QuestService)

-- Report playtime
QuestService:ReportTimeProgress(player, "daily_play_10", 30)

-- Report event
QuestService:ReportEventProgress(player, "win_2_matches", 1)
```

## 🔮 Future: Solana Integration

The system is designed to support Solana smart contracts:
- Points can be converted to tokens
- NFTs can be minted as rewards
- Merkle proofs for claim verification
- Wallet linking already implemented

## 📝 License

ISC
