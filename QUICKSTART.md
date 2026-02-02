# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Roblox Studio (for testing)

## 1. Database Setup (5 minutes)

```bash
# Create database
createdb questlayer

# Run schema
psql questlayer < backend/src/db/schema.sql

# Add example quests (optional)
psql questlayer < backend/src/db/seed.sql
```

## 2. Backend Setup (2 minutes)

```bash
cd backend
npm install

# Create .env file (copy from .env.example and fill in values)
# Minimum required:
# - DATABASE_URL or DB_* variables
# - JWT_SECRET (any random string)
# - ROBLOX_API_KEY (any random string)

npm run dev
```

Backend should start on `http://localhost:3000`

## 3. Web App Setup (2 minutes)

```bash
cd web
npm install

# Create .env file
# Set: NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

npm run dev
```

Web app should start on `http://localhost:3001`

## 4. Test It

1. Open `http://localhost:3001` in your browser
2. You should see the login page
3. For testing without OAuth, you can manually create a user in the database:

```sql
INSERT INTO users (roblox_user_id, username) VALUES ('123456', 'TestUser');
```

Then test the API directly:

```bash
curl http://localhost:3000/api/v1/quests/user/123456
```

## 5. Roblox Integration

1. Open your Roblox game in Roblox Studio
2. Go to `ServerScriptService`
3. Create a folder called `QuestLayer`
4. Copy all `.lua` files from `roblox/` into this folder
5. Edit `QuestService.lua`:
   - Set `API_URL` to `http://localhost:3000/api/v1/events` (or your backend URL)
   - Set `API_KEY` to match your backend `.env` `ROBLOX_API_KEY`
6. Enable HttpService in your game settings
7. Test in Studio or publish

## Environment Variables Quick Reference

### Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=questlayer
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-random-secret-key
ROBLOX_API_KEY=your-random-api-key
CORS_ORIGIN=http://localhost:3001
```

### Web (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Common Issues

**Backend won't start:**
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -l | grep questlayer`
- Check all .env variables are set

**Roblox can't connect:**
- Verify HttpService is enabled in game settings
- Check API_URL and API_KEY match
- Check backend logs for errors
- Ensure backend is accessible from Roblox servers (use ngrok for local testing)

**Web app errors:**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL is correct
- Clear browser cache

## Next Steps

- Create custom quests in the database
- Customize the web UI
- Set up Roblox OAuth for production
- Deploy to production servers
