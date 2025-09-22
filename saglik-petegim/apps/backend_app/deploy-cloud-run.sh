#!/bin/bash

# Google Cloud Run Deployment Script for RAG Backend

PROJECT_ID="saglikpetegim"
PROJECT_NUMBER="606186690780"
SERVICE_NAME="saglik-petegim-rag-backend"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Building Docker image..."
docker build -f Dockerfile.rag -t $IMAGE_NAME .

echo "Pushing to Google Container Registry..."
docker push $IMAGE_NAME

echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8000 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --set-env-vars="GEMINI_API_KEY=$GEMINI_API_KEY,PINECONE_API_KEY=$PINECONE_API_KEY"

echo "Getting service URL..."
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'