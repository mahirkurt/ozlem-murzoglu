#!/usr/bin/env python3
"""
Clean Firestore database - Remove appointments collection and keep only required data
"""

import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        cred_path = Path("D:/GitHub Repos/Saglik-Petegim/apps/flutter_app/saglikpetegim-firebase-adminsdk-fbsvc-c6a289df06.json")
        if cred_path.exists():
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized")
        else:
            logger.error(f"Firebase service account not found at {cred_path}")
            raise FileNotFoundError(f"Service account file not found: {cred_path}")
    
    return firestore.client()

def clean_firestore():
    """Clean unnecessary data from Firestore"""
    db = init_firebase()
    
    logger.info("Starting Firestore cleanup...")
    
    # Delete appointments collection (we'll use protocols instead)
    try:
        logger.info("Deleting appointments collection...")
        appointments_ref = db.collection('appointments')
        docs = appointments_ref.stream()
        batch = db.batch()
        batch_size = 0
        deleted = 0
        
        for doc in docs:
            batch.delete(doc.reference)
            batch_size += 1
            
            if batch_size >= 500:
                batch.commit()
                deleted += batch_size
                logger.info(f"Deleted {deleted} appointment documents")
                batch = db.batch()
                batch_size = 0
        
        if batch_size > 0:
            batch.commit()
            deleted += batch_size
        
        logger.info(f"Total appointments deleted: {deleted}")
    except Exception as e:
        logger.error(f"Error deleting appointments: {e}")
    
    # List all collections to verify
    logger.info("\nCurrent Firestore collections:")
    collections = db.collections()
    for collection in collections:
        count = 0
        for _ in collection.limit(1).stream():
            count = len(list(collection.stream()))
            break
        logger.info(f"- {collection.id}: {count} documents")
    
    logger.info("\nFirestore cleanup complete!")
    
    # Expected collections after cleanup:
    # - patients: Patient records
    # - medical_records: Medical history
    # - protocols: Protocol records
    # - services: Service definitions
    # - payments: Payment records
    # - users: User accounts

if __name__ == "__main__":
    clean_firestore()