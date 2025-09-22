# Google Cloud Run Deployment PowerShell Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Saglik Petegim Backend Deployment" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$PROJECT_ID = "saglikpetegim"
$SERVICE_NAME = "saglik-petegim-rag-backend"
$REGION = "us-central1"

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version 2>$null
    Write-Host "gcloud CLI bulundu!" -ForegroundColor Green
} catch {
    Write-Host "HATA: gcloud CLI kurulu değil!" -ForegroundColor Red
    Write-Host "Önce install-gcloud.ps1 script'ini çalıştırın:" -ForegroundColor Yellow
    Write-Host "cd 'D:\GitHub Repos\Saglik-Petegim'" -ForegroundColor White
    Write-Host ".\install-gcloud.ps1" -ForegroundColor White
    exit 1
}

# Set project
Write-Host "Project ayarlanıyor: $PROJECT_ID" -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Login check
Write-Host ""
Write-Host "Google hesabınıza giriş yapılıyor..." -ForegroundColor Yellow
gcloud auth login

# Enable APIs
Write-Host ""
Write-Host "Gerekli API'ler etkinleştiriliyor..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Deploy
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment başlatılıyor..." -ForegroundColor Cyan
Write-Host "Bu işlem 5-10 dakika sürebilir..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$deployCommand = @"
gcloud run deploy $SERVICE_NAME `
  --source . `
  --port 8080 `
  --memory 2Gi `
  --cpu 2 `
  --max-instances 10 `
  --min-instances 0 `
  --allow-unauthenticated `
  --set-env-vars PORT=8080 `
  --set-env-vars GEMINI_API_KEY=AIzaSyDOQqKR94puGjdVgCuoLe8cjYi8S45rsj4 `
  --set-env-vars PINECONE_API_KEY=pcsk_6EiG8a_7if3putHkNHgiw246W6n2FhA5rkAncyV7mypYMUTjrdrX9ycYWxKgruxEw7wQLR `
  --region $REGION
"@

Invoke-Expression $deployCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "DEPLOYMENT BAŞARILI!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Get service URL
    Write-Host "Service URL alınıyor..." -ForegroundColor Yellow
    $serviceUrl = gcloud run services describe $SERVICE_NAME --region $REGION --format "value(status.url)"
    
    Write-Host ""
    Write-Host "Backend URL: $serviceUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Şimdi yapmanız gerekenler:" -ForegroundColor Yellow
    Write-Host "1. Flutter app'te environment.dart dosyasını güncelleyin:" -ForegroundColor White
    Write-Host "   static const String _prodBackendUrl = '$serviceUrl';" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Flutter'ı yeniden build edin:" -ForegroundColor White
    Write-Host "   cd apps/flutter_app" -ForegroundColor Gray
    Write-Host "   flutter build web --release" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Firebase'e deploy edin:" -ForegroundColor White
    Write-Host "   firebase deploy --only hosting" -ForegroundColor Gray
    Write-Host ""
    
    # Test the endpoint
    Write-Host "Backend'i test etmek için:" -ForegroundColor Yellow
    Write-Host "curl $serviceUrl/health" -ForegroundColor Gray
    
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "DEPLOYMENT BAŞARISIZ!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Lütfen hataları kontrol edin ve tekrar deneyin." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")