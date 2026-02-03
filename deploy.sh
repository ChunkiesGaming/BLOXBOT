#!/usr/bin/env bash
# Backend deploy script - uploads to server and optionally installs/starts
# Usage: ./deploy.sh [--install] [--restart] [--setup]
# Use from Git Bash or WSL on Windows.

set -e

REMOTE_USER="root"
REMOTE_HOST="76.13.123.80"
REMOTE_PATH="/root/backend"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_BACKEND="${SCRIPT_DIR}/backend"

INSTALL=false
RESTART=false
SETUP=false
for arg in "$@"; do
  case $arg in
    --install)  INSTALL=true ;;
    --restart)  RESTART=true ;;
    --setup)    SETUP=true ;;
  esac
done

REMOTE="${REMOTE_USER}@${REMOTE_HOST}"

echo "[Deploy] Backend -> ${REMOTE_PATH} on ${REMOTE_HOST}"

# 1. Upload (exclude node_modules, .env, .git)
echo "[1/3] Uploading..."
ssh "$REMOTE" "mkdir -p $REMOTE_PATH"
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.env' \
  --exclude '.git' \
  "$LOCAL_BACKEND/" "$REMOTE:$REMOTE_PATH/"
echo "Upload done."

# 2. Optional: install
if $INSTALL || $SETUP; then
  echo "[2/3] yarn install..."
  ssh "$REMOTE" "cd $REMOTE_PATH && yarn install --production"
  echo "Install done."
fi

# 3. Optional: create .env
if $SETUP; then
  ssh "$REMOTE" "cd $REMOTE_PATH && ( [ -f .env ] || ( cp env.example.txt .env && echo 'Created .env' ) )"
fi

# 4. Optional: restart
if $RESTART || $SETUP; then
  echo "[3/3] Restarting app..."
  ssh "$REMOTE" "cd $REMOTE_PATH && \
    if command -v pm2 &>/dev/null; then \
      pm2 restart quest-layer-backend 2>/dev/null || pm2 start src/index.js --name quest-layer-backend; \
    else \
      pkill -f 'node src/index.js' 2>/dev/null; \
      nohup node src/index.js > backend.log 2>&1 & \
      echo 'Started with nohup'; \
    fi"
  echo "Restart done."
fi

echo "[Deploy] Complete. Backend at $REMOTE_PATH on $REMOTE_HOST"
