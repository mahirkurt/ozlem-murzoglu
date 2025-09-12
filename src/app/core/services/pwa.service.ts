import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { interval } from 'rxjs';

/**
 * Progressive Web App Service
 * Manages service worker, offline functionality, and app updates
 */
@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private swUpdate = inject(SwUpdate);

  // Update check interval (6 hours)
  private readonly UPDATE_CHECK_INTERVAL = 6 * 60 * 60 * 1000;

  // Cache names
  private readonly CACHE_NAMES = {
    static: 'static-cache-v1',
    dynamic: 'dynamic-cache-v1',
    images: 'images-cache-v1',
    api: 'api-cache-v1',
  };

  // Offline fallback pages
  private readonly OFFLINE_PAGES = {
    main: '/offline',
    error: '/error',
  };

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.initializeServiceWorker();
      this.checkForUpdates();
      this.handleAppUpdate();
    }
  }

  /**
   * Initialize service worker
   */
  private initializeServiceWorker(): void {
    // Register custom service worker if needed
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
      this.setupOfflineHandler();
      this.setupCacheStrategies();
      this.setupBackgroundSync();
      this.setupPushNotifications();
    }
  }

  /**
   * Register service worker
   */
  private async registerServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register('/ngsw-worker.js');
      console.log('Service Worker registered:', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              this.notifyUserOfUpdate();
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Setup offline handler
   */
  private setupOfflineHandler(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Check initial state
    if (!navigator.onLine) {
      this.handleOffline();
    }
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    console.log('Application is online');
    this.syncOfflineData();
    this.showNotification('Bağlantı yeniden kuruldu', 'İnternet bağlantınız aktif');
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    console.log('Application is offline');
    this.showNotification(
      'Çevrimdışı mod',
      'İnternet bağlantısı yok, bazı özellikler kısıtlı olabilir'
    );
  }

  /**
   * Setup cache strategies
   */
  private setupCacheStrategies(): void {
    // Implement different caching strategies for different resources
    this.setupStaticCache();
    this.setupDynamicCache();
    this.setupImageCache();
    this.setupApiCache();
  }

  /**
   * Setup static cache (app shell)
   */
  private async setupStaticCache(): Promise<void> {
    const staticAssets = [
      '/',
      '/index.html',
      '/styles.css',
      '/main.js',
      '/polyfills.js',
      '/runtime.js',
      '/manifest.json',
      '/offline',
      '/logos/OM-Icon-Color.svg',
    ];

    try {
      const cache = await caches.open(this.CACHE_NAMES.static);
      await cache.addAll(staticAssets);
      console.log('Static cache initialized');
    } catch (error) {
      console.error('Failed to setup static cache:', error);
    }
  }

  /**
   * Setup dynamic cache
   */
  private setupDynamicCache(): void {
    // Cache dynamic content as it's requested
    self.addEventListener('fetch', (event: any) => {
      if (event.request.url.includes('/api/')) {
        return; // Skip API requests
      }

      event.respondWith(
        caches
          .match(event.request)
          .then((response) => {
            return (
              response ||
              fetch(event.request).then((fetchResponse) => {
                return caches.open(this.CACHE_NAMES.dynamic).then((cache) => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
              })
            );
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(this.OFFLINE_PAGES.main);
            }
          })
      );
    });
  }

  /**
   * Setup image cache
   */
  private setupImageCache(): void {
    // Implement cache-first strategy for images
    self.addEventListener('fetch', (event: any) => {
      if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        event.respondWith(
          caches.open(this.CACHE_NAMES.images).then((cache) => {
            return cache.match(event.request).then((response) => {
              return (
                response ||
                fetch(event.request).then((fetchResponse) => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                })
              );
            });
          })
        );
      }
    });
  }

  /**
   * Setup API cache
   */
  private setupApiCache(): void {
    // Implement network-first strategy for API calls
    self.addEventListener('fetch', (event: any) => {
      if (event.request.url.includes('/api/')) {
        event.respondWith(
          fetch(event.request)
            .then((response) => {
              return caches.open(this.CACHE_NAMES.api).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
            })
            .catch(() => {
              return caches.match(event.request);
            })
        );
      }
    });
  }

  /**
   * Setup background sync
   */
  private setupBackgroundSync(): void {
    if ('sync' in self.registration) {
      // Register sync event
      self.addEventListener('sync', (event: any) => {
        if (event.tag === 'sync-appointments') {
          event.waitUntil(this.syncAppointments());
        }
      });
    }
  }

  /**
   * Sync appointments when online
   */
  private async syncAppointments(): Promise<void> {
    try {
      // Get pending appointments from IndexedDB
      const pendingAppointments = await this.getPendingAppointments();

      // Send to server
      for (const appointment of pendingAppointments) {
        await this.sendAppointmentToServer(appointment);
      }

      // Clear pending appointments
      await this.clearPendingAppointments();

      this.showNotification('Senkronizasyon tamamlandı', 'Bekleyen randevularınız gönderildi');
    } catch (error) {
      console.error('Failed to sync appointments:', error);
    }
  }

  /**
   * Setup push notifications
   */
  private async setupPushNotifications(): Promise<void> {
    if ('PushManager' in window) {
      try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              'YOUR_VAPID_PUBLIC_KEY' // Replace with actual VAPID key
            ),
          });

          // Send subscription to server
          await this.sendSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error('Failed to setup push notifications:', error);
      }
    }
  }

  /**
   * Check for app updates periodically
   */
  private checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      // Check immediately
      this.swUpdate.checkForUpdate();

      // Check periodically
      interval(this.UPDATE_CHECK_INTERVAL).subscribe(() => {
        this.swUpdate.checkForUpdate();
      });
    }
  }

  /**
   * Handle app update
   */
  private handleAppUpdate(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map((evt) => ({
            current: evt.currentVersion,
            available: evt.latestVersion,
          }))
        )
        .subscribe((versions) => {
          console.log('New version available:', versions);
          this.promptUserToUpdate();
        });
    }
  }

  /**
   * Prompt user to update app
   */
  private promptUserToUpdate(): void {
    if (confirm('Yeni bir güncelleme mevcut. Şimdi yüklemek ister misiniz?')) {
      this.updateApp();
    }
  }

  /**
   * Update app to latest version
   */
  public async updateApp(): Promise<void> {
    if (this.swUpdate.isEnabled) {
      try {
        await this.swUpdate.activateUpdate();
        document.location.reload();
      } catch (error) {
        console.error('Failed to update app:', error);
      }
    }
  }

  /**
   * Clear all caches
   */
  public async clearAllCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }

  /**
   * Get cache size
   */
  public async getCacheSize(): Promise<number> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  /**
   * Sync offline data when back online
   */
  private async syncOfflineData(): Promise<void> {
    if ('sync' in self.registration) {
      try {
        await self.registration.sync.register('sync-data');
      } catch (error) {
        console.error('Failed to register sync:', error);
      }
    }
  }

  /**
   * Show notification
   */
  private showNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logos/OM-Icon-Color.svg',
        badge: '/logos/OM-Icon-Color.svg',
        vibrate: [200, 100, 200],
      });
    }
  }

  /**
   * Notify user of update
   */
  private notifyUserOfUpdate(): void {
    this.showNotification(
      'Uygulama güncellendi',
      'Yeni özellikler ve iyileştirmeler kullanıma hazır'
    );
  }

  /**
   * Helper functions for IndexedDB operations
   */
  private async getPendingAppointments(): Promise<any[]> {
    // Implement IndexedDB logic to get pending appointments
    return [];
  }

  private async sendAppointmentToServer(appointment: any): Promise<void> {
    // Implement API call to send appointment
  }

  private async clearPendingAppointments(): Promise<void> {
    // Implement IndexedDB logic to clear pending appointments
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    // Implement API call to send subscription
  }

  /**
   * Convert VAPID key
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Check if app is installed
   */
  public isAppInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  /**
   * Prompt to install app
   */
  public async promptInstall(): Promise<void> {
    const deferredPrompt = (window as any).deferredPrompt;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }

      (window as any).deferredPrompt = null;
    }
  }
}
