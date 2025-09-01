import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { StrapiService } from './services/strapi.service';
import { CacheService } from './services/cache.service';
import { ResourcesController } from './controllers/resources.controller';

// Firebase Admin SDK'yı başlat
admin.initializeApp();

// Servisleri initialize et
const strapiService = new StrapiService();
const cacheService = new CacheService();
const resourcesController = new ResourcesController(strapiService, cacheService);

// CORS yapılandırması
const corsOptions = {
  origin: true, // Production'da domain'i belirtin
  credentials: true
};

/**
 * Tüm resource'ları getir
 */
export const getResources = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    try {
      const locale = req.query.locale as string || 'tr';
      const category = req.query.category as string;
      
      const resources = await resourcesController.getResources(locale, category);
      res.status(200).json({
        success: true,
        data: resources
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resources'
      });
    }
  });

/**
 * Tek bir resource getir
 */
export const getResource = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    try {
      const resourceKey = req.query.resourceKey as string;
      const categoryKey = req.query.categoryKey as string;
      const locale = req.query.locale as string || 'tr';
      
      if (!resourceKey || !categoryKey) {
        res.status(400).json({
          success: false,
          error: 'resourceKey and categoryKey are required'
        });
        return;
      }
      
      const resource = await resourcesController.getResource(resourceKey, categoryKey, locale);
      
      if (!resource) {
        res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: resource
      });
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resource'
      });
    }
  });

/**
 * Resource'larda arama yap
 */
export const searchResources = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    try {
      const query = req.query.q as string;
      const locale = req.query.locale as string || 'tr';
      
      if (!query || query.length < 2) {
        res.status(400).json({
          success: false,
          error: 'Search query must be at least 2 characters'
        });
        return;
      }
      
      const results = await resourcesController.searchResources(query, locale);
      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error searching resources:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search resources'
      });
    }
  });

/**
 * Kategorileri getir
 */
export const getCategories = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    try {
      const locale = req.query.locale as string || 'tr';
      const categories = await resourcesController.getCategories(locale);
      
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      });
    }
  });

/**
 * Cache'i temizle (Admin only)
 */
export const clearCache = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    try {
      // Auth kontrolü ekleyin
      const authToken = req.headers.authorization;
      if (!authToken || !authToken.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }
      
      // Token'ı doğrula (Firebase Auth veya custom token)
      // const decodedToken = await admin.auth().verifyIdToken(authToken.replace('Bearer ', ''));
      
      cacheService.clearAll();
      
      res.status(200).json({
        success: true,
        message: 'Cache cleared successfully'
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache'
      });
    }
  });

/**
 * Strapi webhook'u için endpoint
 * Strapi'de içerik güncellendiğinde cache'i temizle
 */
export const strapiWebhook = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    try {
      // Webhook secret'ı kontrol et
      const webhookSecret = req.headers['x-strapi-signature'];
      const expectedSecret = functions.config().strapi?.webhook_secret;
      
      if (webhookSecret !== expectedSecret) {
        res.status(401).json({
          success: false,
          error: 'Invalid webhook signature'
        });
        return;
      }
      
      // Event tipine göre işlem yap
      const event = req.body.event;
      const model = req.body.model;
      
      console.log(`Strapi webhook received: ${event} on ${model}`);
      
      // Resource güncellendiğinde cache'i temizle
      if (model === 'resource') {
        cacheService.clearPattern('resource:*');
      }
      
      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process webhook'
      });
    }
  });