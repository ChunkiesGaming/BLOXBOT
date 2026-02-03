# Backend deploy script (Windows PowerShell only)
# Run from this folder: .\deploy.ps1 [-Setup] [-Install] [-Restart]
# -Setup: first-time (upload + install + .env + restart)
# -Install: upload + yarn install
# -Restart: upload + restart app

param(
    [switch]$Install,
    [switch]$Restart,
    [switch]$Setup
)

$ErrorActionPreference = "Stop"

# === CONFIGURE THESE ===
$REMOTE_USER = "root"
$REMOTE_HOST = "76.13.123.80"
$REMOTE_PATH = "/root/backend"
# This folder (where the script lives) = what gets uploaded
$LOCAL_BACKEND = $PSScriptRoot

$REMOTE = "${REMOTE_USER}@${REMOTE_HOST}"

Write-Host "Deploy backend to $REMOTE_PATH on $REMOTE_HOST" -ForegroundColor Cyan

# 1. Upload via SCP (exclude node_modules, .env, .git)
Write-Host "`n[1/3] Uploading backend via SCP..." -ForegroundColor Yellow
& ssh $REMOTE "mkdir -p $REMOTE_PATH"
if ($LASTEXITCODE -ne 0) { throw "SSH mkdir failed" }

$tempDir = [System.IO.Path]::GetTempPath() + "backend_deploy_" + [Guid]::NewGuid().ToString("n").Substring(0, 8)
try {
    # Copy backend to temp dir excluding node_modules, .env, .git (robocopy: /E = subdirs, /XD = exclude dirs, /XF = exclude files)
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    & robocopy $LOCAL_BACKEND $tempDir /E /XD node_modules .git /XF .env /NFL /NDL /NJH /NJS /nc /ns /np
    if ($LASTEXITCODE -ge 8) { throw "Robocopy failed" }   # robocopy exit 0-7 = success

    # SCP upload to staging folder on server
    $staging = "/root/backend_deploy"
    & ssh $REMOTE "rm -rf $staging; mkdir -p $staging"
    if ($LASTEXITCODE -ne 0) { throw "SSH mkdir staging failed" }
    & scp -r "${tempDir}\*" "${REMOTE}:${staging}/"
    if ($LASTEXITCODE -ne 0) { throw "SCP failed" }

    # On server: keep .env from existing backend, replace backend with new files, fix Windows paths
    & ssh $REMOTE "cp $REMOTE_PATH/.env $staging/ 2>/dev/null || true; rm -rf $REMOTE_PATH; mv $staging $REMOTE_PATH; cd $REMOTE_PATH && find . -type f -name \$'*\\\\*' 2>/dev/null | while IFS= read -r f; do dest=\$(echo \"\$f\" | tr '\\\\' '/'); mkdir -p \"\$(dirname \"\$dest\")\"; mv \"\$f\" \"\$dest\"; done"
    if ($LASTEXITCODE -ne 0) { throw "SSH post-upload failed" }
} finally {
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue }
}

Write-Host "Upload done." -ForegroundColor Green

if ($Install -or $Setup) {
    Write-Host "`n[2/3] Installing dependencies (npm install)..." -ForegroundColor Yellow
    & ssh $REMOTE "cd $REMOTE_PATH && npm install --production"
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    Write-Host "Install done." -ForegroundColor Green
}

if ($Setup) {
    Write-Host "`nCreating .env from example (edit on server if needed)..." -ForegroundColor Yellow
    & ssh $REMOTE "cd $REMOTE_PATH && if [ ! -f .env ]; then cp env.example.txt .env; echo 'Created .env'; else echo '.env exists'; fi"
}

if ($Restart -or $Setup) {
    Write-Host "`n[3/3] Restarting app..." -ForegroundColor Yellow
    & ssh $REMOTE "cd $REMOTE_PATH && if command -v pm2 >/dev/null 2>&1; then pm2 restart quest-layer-backend 2>/dev/null || pm2 start src/index.js --name quest-layer-backend; else pkill -f 'node src/index.js' 2>/dev/null; nohup node src/index.js > backend.log 2>&1 &; echo 'Started with nohup'; fi"
    Write-Host "Restart done." -ForegroundColor Green
}

Write-Host "`nDeploy complete. Backend at $REMOTE_PATH on $REMOTE_HOST" -ForegroundColor Cyan
