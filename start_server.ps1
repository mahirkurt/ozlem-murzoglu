$port = 4000
Write-Host "Starting Dr. Ozlem Murzoglu Dev Server on Port $port..." -ForegroundColor Cyan

# Check if port is in use and kill it
$tcpConnection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($tcpConnection) {
    Write-Host "Port $port is in use. Attempting to clear..." -ForegroundColor Yellow
    $processId = $tcpConnection.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Write-Host "Port cleared." -ForegroundColor Green
}

# Clean cache significantly
if (Test-Path ".angular") {
    Write-Host "Cleaning .angular cache..." -ForegroundColor Gray
    Remove-Item ".angular" -Recurse -Force -ErrorAction SilentlyContinue
}

# Start Server
Write-Host "Launching Angular Server..." -ForegroundColor Green
Write-Host "Access at: http://localhost:$port" -ForegroundColor Cyan
Write-Host "----------------------------------------"

# Run command and keep window open on error
try {
    npx ng serve --port $port --host 0.0.0.0 --disable-host-check
} catch {
    Write-Host "Server crashed!" -ForegroundColor Red
    Write-Error $_
}

Read-Host -Prompt "Press Enter to exit"
