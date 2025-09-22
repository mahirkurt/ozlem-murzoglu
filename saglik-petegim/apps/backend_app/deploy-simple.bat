@echo off
echo ========================================
echo Saglik Petegim Backend Deployment Script
echo ========================================
echo.
echo Bu script gcloud CLI gerektirir!
echo.
echo Eger gcloud kurulu degilse:
echo 1. https://cloud.google.com/sdk/docs/install adresinden indirin
echo 2. Kurulum sonrasi bu script'i tekrar calistirin
echo.
pause

echo.
echo Deploying to Google Cloud Run...
echo.

REM Set variables
SET PROJECT_ID=saglikpetegim
SET SERVICE_NAME=saglik-petegim-rag-backend
SET REGION=us-central1

REM Set project
gcloud config set project %PROJECT_ID%

REM Enable required APIs
echo Enabling required APIs...
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

REM Deploy directly from source
echo.
echo Starting deployment...
gcloud run deploy %SERVICE_NAME% ^
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
  --region %REGION%

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Getting service URL...
gcloud run services describe %SERVICE_NAME% --region %REGION% --format "value(status.url)"
echo.
pause