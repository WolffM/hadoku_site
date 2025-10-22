#!/usr/bin/env pwsh
# Update Cloudflare Worker secrets directly from .env file
# Usage: .\scripts\update-cloudflare-secrets.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔐 Updating Cloudflare Worker Secrets from .env" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Load .env file
$envPath = "$PSScriptRoot\..\..\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env file not found at: $envPath" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Loading secrets from .env..." -ForegroundColor Yellow
$envVars = @{}
Get-Content $envPath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $key, $value = $line.Split("=", 2)
        $envVars[$key.Trim()] = $value.Trim()
    }
}

# Change to task-api directory
Push-Location "$PSScriptRoot\..\workers\task-api"

try {
    # Update ADMIN_KEYS
    if ($envVars.ContainsKey("ADMIN_KEYS")) {
        Write-Host "🔐 Updating ADMIN_KEYS..." -ForegroundColor Green
        $adminKeys = $envVars["ADMIN_KEYS"]
        Write-Host "   Preview: $($adminKeys.Substring(0, [Math]::Min(50, $adminKeys.Length)))..." -ForegroundColor Gray
        $adminKeys | npx wrangler secret put ADMIN_KEYS
        Write-Host "   ✅ ADMIN_KEYS updated" -ForegroundColor Green
    } else {
        Write-Host "⚠️  ADMIN_KEYS not found in .env" -ForegroundColor Yellow
    }

    Write-Host ""

    # Update FRIEND_KEYS
    if ($envVars.ContainsKey("FRIEND_KEYS")) {
        Write-Host "🔐 Updating FRIEND_KEYS..." -ForegroundColor Green
        $friendKeys = $envVars["FRIEND_KEYS"]
        Write-Host "   Preview: $($friendKeys.Substring(0, [Math]::Min(50, $friendKeys.Length)))..." -ForegroundColor Gray
        $friendKeys | npx wrangler secret put FRIEND_KEYS
        Write-Host "   ✅ FRIEND_KEYS updated" -ForegroundColor Green
    } else {
        Write-Host "⚠️  FRIEND_KEYS not found in .env" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "✨ All secrets updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "ℹ️  Note: These secrets are now stored in Cloudflare." -ForegroundColor Cyan
    Write-Host "ℹ️  They will persist across deployments until you update them again." -ForegroundColor Cyan

} finally {
    Pop-Location
}
