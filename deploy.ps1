# Backend deploy script - uploads to server and optionally installs/starts
# Usage: .\deploy.ps1 [-Install] [-Restart]
# -Install: SSH in and run yarn install
# -Restart: SSH in and restart the app (pm2 or node)

param(
    [switch]$Install,
    [switch]$Restart,
    [switch]$Setup   # First-time: upload, install, create .env from example
)

$ErrorActionPreference = "Stop"

# === CONFIGURE THESE ===
$REMOTE_USER = "root"
$REMOTE_HOST = "76.13.123.80"
$REMOTE_PATH = "/root/backend"   # Where backend lives on server
$LOCAL_BACKEND = "$PSScriptRoot\backend"

# Don't put password in script - use SSH key or enter when prompted
# To use key: ssh-copy-id root@76.13.123.80 (from Git Bash/WSL)

$REMOTE = "${REMOTE_USER}@${REMOTE_HOST}"

Write-Host "Deploy backend to $REMOTE_PATH on $REMOTE_HOST" -ForegroundColor Cyan

# 1. Upload files (exclude node_modules, .env, .git)
Write-Host "`n[1/3] Uploading backend..." -ForegroundColor Yellow
$exclude = @(
    "node_modules",
    ".env",
    ".git"
)
$items = Get-ChildItem -Path $LOCAL_BACKEND -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($LOCAL_BACKEND.Length + 1)
    $skip = $false
    foreach ($e in $exclude) {
        if ($rel -like "$e*" -or $rel -like "*\$e\*") { $skip = $true; break }
    }
    -not $skip
}

# Create remote dir and upload each (scp doesn't support exclude on Windows easily)
& ssh $REMOTE "mkdir -p $REMOTE_PATH"
if ($LASTEXITCODE -ne 0) { throw "SSH mkdir failed" }

# Use scp -r but we'll sync by archiving and extracting to avoid exclude issues
$tempZip = [System.IO.Path]::GetTempFileName() + ".zip"
try {
    Compress-Archive -Path "$LOCAL_BACKEND\*" -DestinationPath $tempZip -Force
    # Remove node_modules from zip by re-zipping without it
    $tempDir = [System.IO.Path]::GetTempPath() + [Guid]::NewGuid().ToString()
    Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force
    if (Test-Path "$tempDir\node_modules") { Remove-Item "$tempDir\node_modules" -Recurse -Force }
    if (Test-Path "$tempDir\.env") { Remove-Item "$tempDir\.env" -Force }
    Compress-Archive -Path "$tempDir\*" -DestinationPath $tempZip -Force
    Remove-Item $tempDir -Recurse -Force

    & scp $tempZip "${REMOTE}:${REMOTE_PATH}/deploy.zip"
    if ($LASTEXITCODE -ne 0) { throw "SCP failed" }
    & ssh $REMOTE "cd $REMOTE_PATH && unzip -o deploy.zip && rm deploy.zip"
    if ($LASTEXITCODE -ne 0) { throw "Unzip on server failed" }
} finally {
    if (Test-Path $tempZip) { Remove-Item $tempZip -Force }
}

Write-Host "Upload done." -ForegroundColor Green

# 2. Optional: install deps
if ($Install -or $Setup) {
    Write-Host "`n[2/3] Installing dependencies (yarn install)..." -ForegroundColor Yellow
    & ssh $REMOTE "cd $REMOTE_PATH && yarn install --production"
    if ($LASTEXITCODE -ne 0) { throw "yarn install failed" }
    Write-Host "Install done." -ForegroundColor Green
}

# 3. Optional: create .env from example (setup only)
if ($Setup) {
    Write-Host "`nCreating .env from example (edit on server if needed)..." -ForegroundColor Yellow
    & ssh $REMOTE "cd $REMOTE_PATH && if [ ! -f .env ]; then cp env.example.txt .env; echo 'Created .env'; else echo '.env exists'; fi"
}

# 4. Optional: restart app
if ($Restart -or $Setup) {
    Write-Host "`n[3/3] Restarting app..." -ForegroundColor Yellow
    & ssh $REMOTE @"
cd $REMOTE_PATH
if command -v pm2 &>/dev/null; then
  pm2 restart quest-layer-backend 2>/dev/null || pm2 start src/index.js --name quest-layer-backend
else
  (pkill -f 'node src/index.js' 2>/dev/null; nohup node src/index.js > backend.log 2>&1 &)
  echo 'Started with nohup (no pm2)'
fi
"@
    Write-Host "Restart done." -ForegroundColor Green
}

Write-Host "`nDeploy complete. Backend at $REMOTE_PATH on $REMOTE_HOST" -ForegroundColor Cyan
