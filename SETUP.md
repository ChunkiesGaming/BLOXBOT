# Setup Guide

## Quick Start

### 1. Database Setup

```bash
# Install PostgreSQL if not already installed
# Create database
createdb questlayer

# Run schema
psql questlayer < backend/src/db/schema.sql

# Seed example quests (optional)
psql questlayer < backend/src/db/seed.sql
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy and edit environment file
cp .env.example .env
# Edit .env with your settings:
# - Database credentials
# - JWT_SECRET (generate a random string)
# - ROBLOX_API_KEY (generate a random string for server auth)
# - Roblox OAuth credentials (if using OAuth)

npm run dev
```

Backend will run on `http://localhost:4000`

### 3. Web App Setup

```bash
cd web
npm install

# Copy and edit environment file
cp .env.example .env
# Edit .env:
# - NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

npm run dev
```

Web app will run on `http://localhost:3000`

### 4. Roblox Integration

1. Open your Roblox game in Roblox Studio
2. In `ServerScriptService`, create a folder called `QuestLayer`
3. Copy all files from `roblox/` into this folder
4. Edit `QuestService.lua`:
   - Set `API_URL` to your backend URL (e.g., `http://localhost:4000/api/v1/events`)
   - Set `API_KEY` to match your `ROBLOX_API_KEY` from backend `.env`
5. Publish your game

### 5. Create Your First Quest

Connect to your database and insert a quest:

```sql
INSERT INTO quests (quest_id, name, description, quest_type, target_value, reward_points, cooldown_hours)
VALUES ('daily_play_10', 'Play 10 Minutes', 'Play for 10 minutes to earn points', 'time', 600, 50, 24);
```

## Testing

### Test Backend

```bash
# Health check
curl http://localhost:3000/health

# Test event endpoint (requires API key)
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "robloxUserId": "123456",
    "questId": "daily_play_10",
    "data": {"delta": 30},
    "serverTime": 1234567890
  }'
```

### Test Web App

1. Navigate to `http://localhost:3000`
2. Click "Login with Roblox" (requires OAuth setup)
3. View quests and points

## Roblox OAuth Setup (Optional)

If you want to use Roblox OAuth for web login:

1. Go to [Roblox Creator Dashboard](https://create.roblox.com/)
2. Navigate to OAuth Apps
3. Create a new OAuth app
4. Set redirect URI to: `http://localhost:3000/api/v1/auth/roblox/callback`
5. Copy Client ID and Client Secret to backend `.env`

## Production Deployment

### Backend

- Use environment variables for all secrets
- Set `NODE_ENV=production`
- Use a process manager like PM2
- Set up proper CORS origins
- Use HTTPS

### Web App

- Build: `npm run build`
- Start: `npm start`
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Deploy to Vercel, Netlify, or your own server

### Database

- Use managed PostgreSQL (AWS RDS, Heroku Postgres, etc.)
- Set up regular backups
- Monitor performance

## Troubleshooting

### Backend won't start
- Check database connection
- Verify all environment variables are set
- Check port 4000 is not in use

### Roblox events not working
- Verify API key matches in both places
- Check backend logs for errors
- Ensure HttpService is enabled in Roblox game settings

### Web app can't connect
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running
