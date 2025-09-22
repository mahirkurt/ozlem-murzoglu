@echo off
echo ========================================
echo SAGLIK PETEGIM BACKEND DEPLOYMENT
echo ========================================
echo.

REM Proje ayarla
echo Setting project...
gcloud config set project saglikpetegim

REM Gerekli API'leri etkinleştir
echo.
echo Enabling required APIs...
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

REM Deploy
echo.
echo ========================================
echo Starting deployment to Cloud Run...
echo This may take 5-10 minutes...
echo ========================================
echo.

gcloud run deploy saglik-petegim-rag-backend ^
  --source . ^
  --port 8080 ^
  --memory 2Gi ^
  --cpu 2 ^
  --max-instances 10 ^
  --min-instances 0 ^
  --allow-unauthenticated ^
  --set-env-vars PORT=8080 ^
  --set-env-vars GEMINI_API_KEY=AIzaSyDOQqKR94puGjdVgCuoLe8cjYi8S45rsj4 ^
  --set-env-vars PINECONE_API_KEY=pcsk_6EiG8a_7if3putHkNHgiw246W6n2FhA5rkAncyV7mypYMUTjrdrX9ycYWxKgruxEw7wQLR ^
  --region us-central1

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Getting service URL...
gcloud run services describe saglik-petegim-rag-backend --region us-central1 --format "value(status.url)"
echo.
echo Next steps:
echo 1. Copy the URL above
echo 2. Update apps/flutter_app/lib/config/environment.dart with this URL
echo 3. Rebuild Flutter: flutter build web --release
echo 4. Deploy to Firebase: firebase deploy --only hosting
echo.
pause