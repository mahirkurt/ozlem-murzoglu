import { Injectable, signal, computed, effect, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, interval, of } from 'rxjs';
import { catchError, debounceTime, map, retry, switchMap, tap } from 'rxjs/operators';

/**
 * Cloud Integration Service
 * Theme sync across devices, user preference backup, collaborative features
 */

export interface CloudUserProfile {
  id: string;
  email: string;
  preferences: UserPreferences;
  devices: DeviceInfo[];
  lastSync: Date;
  storageUsed: number;
  storageLimit: number;
}

export interface UserPreferences {
  theme: ThemePreferences;
  language: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
  customizations: Record<string, any>;
}

export interface ThemePreferences {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'standard' | 'high';
  animations: boolean;
  customTheme?: any;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'tablet' | 'mobile';
  os: string;
  browser: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  appointments: boolean;
  updates: boolean;
  marketing: boolean;
}

export interface AccessibilitySettings {
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: number;
  colorBlindMode?: 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  error: string | null;
}

export interface CollaborativeSession {
  id: string;
  participants: Participant[];
  sharedData: any;
  lastActivity: Date;
  isActive: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  selection?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CloudSyncService implements OnDestroy {
  // API Configuration
  private readonly API_BASE = 'https://api.ozlemmurzoglu.com/v1';
  private readonly WS_URL = 'wss://ws.ozlemmurzoglu.com';

  // State Management
  private userProfile = signal<CloudUserProfile | null>(null);
  private syncStatus = signal<SyncStatus>({
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    error: null,
  });
  private isOnline = signal(navigator.onLine);
  private pendingQueue = signal<any[]>([]);
  private collaborativeSessions = signal<Map<string, CollaborativeSession>>(new Map());

  // WebSocket for real-time sync
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Computed values
  public profile = computed(() => this.userProfile());
  public status = computed(() => this.syncStatus());
  public online = computed(() => this.isOnline());
  public hasUnsyncedChanges = computed(() => this.pendingQueue().length > 0);

  // Auto-sync configuration
  private autoSyncInterval = 30000; // 30 seconds
  private autoSyncSubscription: any;

  constructor(private http: HttpClient) {
    this.initializeCloudSync();
  }

  /**
   * Initialize cloud sync
   */
  private initializeCloudSync(): void {
    // Monitor online status
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Setup auto-sync
    this.setupAutoSync();

    // Setup WebSocket connection
    this.connectWebSocket();

    // Load cached preferences
    this.loadCachedPreferences();

    // Setup sync effect
    effect(() => {
      if (this.isOnline() && this.pendingQueue().length > 0) {
        this.processPendingQueue();
      }
    });
  }

  /**
   * Authenticate and get user profile
   */
  public async authenticate(token: string): Promise<CloudUserProfile> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    try {
      const profile = await this.http
        .get<CloudUserProfile>(`${this.API_BASE}/user/profile`, { headers })
        .toPromise();

      if (profile) {
        this.userProfile.set(profile);
        this.saveAuthToken(token);
        await this.syncPreferences();
      }

      return profile!;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  /**
   * Connect WebSocket for real-time sync
   */
  private connectWebSocket(): void {
    const token = this.getAuthToken();
    if (!token) return;

    try {
      this.websocket = new WebSocket(`${this.WS_URL}?token=${token}`);

      this.websocket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.subscribeToChannels();
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event.data);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.websocket.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleWebSocketReconnect();
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  /**
   * Handle WebSocket messages
   */
  private handleWebSocketMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'preference_update':
          this.handleRemotePreferenceUpdate(message.data);
          break;

        case 'device_sync':
          this.handleDeviceSync(message.data);
          break;

        case 'collaborative_update':
          this.handleCollaborativeUpdate(message.data);
          break;

        case 'notification':
          this.handleCloudNotification(message.data);
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Sync preferences to cloud
   */
  public async syncPreferences(preferences?: Partial<UserPreferences>): Promise<void> {
    if (!this.isOnline()) {
      this.queueForSync({ type: 'preferences', data: preferences });
      return;
    }

    this.updateSyncStatus({ isSyncing: true });

    try {
      const currentPrefs = this.userProfile()?.preferences || ({} as UserPreferences);
      const updatedPrefs = { ...currentPrefs, ...preferences };

      const response = await this.http
        .put<UserPreferences>(`${this.API_BASE}/user/preferences`, updatedPrefs, {
          headers: this.getAuthHeaders(),
        })
        .toPromise();

      if (response) {
        this.userProfile.update((profile) =>
          profile
            ? {
                ...profile,
                preferences: response,
                lastSync: new Date(),
              }
            : null
        );

        this.saveToLocalStorage('user_preferences', response);
        this.broadcastToOtherDevices('preference_update', response);
      }

      this.updateSyncStatus({
        isSyncing: false,
        lastSync: new Date(),
        error: null,
      });
    } catch (error) {
      this.updateSyncStatus({
        isSyncing: false,
        error: 'Failed to sync preferences',
      });
      throw error;
    }
  }

  /**
   * Sync theme across devices
   */
  public async syncTheme(theme: Partial<ThemePreferences>): Promise<void> {
    const preferences = this.userProfile()?.preferences;
    if (!preferences) return;

    const updatedPreferences = {
      ...preferences,
      theme: { ...preferences.theme, ...theme },
    };

    await this.syncPreferences(updatedPreferences);

    // Broadcast theme change to other devices
    this.broadcastToOtherDevices('theme_change', theme);
  }

  /**
   * Get devices associated with account
   */
  public async getDevices(): Promise<DeviceInfo[]> {
    try {
      const devices = await this.http
        .get<DeviceInfo[]>(`${this.API_BASE}/user/devices`, { headers: this.getAuthHeaders() })
        .toPromise();

      return devices || [];
    } catch (error) {
      console.error('Failed to get devices:', error);
      return [];
    }
  }

  /**
   * Register current device
   */
  public async registerDevice(): Promise<DeviceInfo> {
    const deviceInfo: Partial<DeviceInfo> = {
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      os: this.getOS(),
      browser: this.getBrowser(),
      lastActive: new Date(),
    };

    try {
      const device = await this.http
        .post<DeviceInfo>(`${this.API_BASE}/user/devices`, deviceInfo, {
          headers: this.getAuthHeaders(),
        })
        .toPromise();

      if (device) {
        this.saveDeviceId(device.id);
      }

      return device!;
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  /**
   * Remove device from account
   */
  public async removeDevice(deviceId: string): Promise<void> {
    try {
      await this.http
        .delete(`${this.API_BASE}/user/devices/${deviceId}`, { headers: this.getAuthHeaders() })
        .toPromise();

      // Update local device list
      this.userProfile.update((profile) => {
        if (profile) {
          profile.devices = profile.devices.filter((d) => d.id !== deviceId);
        }
        return profile;
      });
    } catch (error) {
      console.error('Failed to remove device:', error);
      throw error;
    }
  }

  /**
   * Start collaborative session
   */
  public async startCollaborativeSession(data: any): Promise<CollaborativeSession> {
    try {
      const session = await this.http
        .post<CollaborativeSession>(
          `${this.API_BASE}/collaboration/sessions`,
          { data },
          { headers: this.getAuthHeaders() }
        )
        .toPromise();

      if (session) {
        this.collaborativeSessions.update((sessions) => {
          sessions.set(session.id, session);
          return new Map(sessions);
        });

        // Join WebSocket room for real-time collaboration
        this.joinCollaborativeRoom(session.id);
      }

      return session!;
    } catch (error) {
      console.error('Failed to start collaborative session:', error);
      throw error;
    }
  }

  /**
   * Join collaborative room
   */
  private joinCollaborativeRoom(sessionId: string): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({
          type: 'join_room',
          room: sessionId,
        })
      );
    }
  }

  /**
   * Send collaborative update
   */
  public sendCollaborativeUpdate(sessionId: string, update: any): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({
          type: 'collaborative_update',
          sessionId,
          data: update,
        })
      );
    } else {
      this.queueForSync({
        type: 'collaborative_update',
        sessionId,
        data: update,
      });
    }
  }

  /**
   * Handle collaborative update from other participants
   */
  private handleCollaborativeUpdate(data: any): void {
    const { sessionId, update, participantId } = data;

    this.collaborativeSessions.update((sessions) => {
      const session = sessions.get(sessionId);
      if (session) {
        // Update shared data
        session.sharedData = { ...session.sharedData, ...update };
        session.lastActivity = new Date();

        // Update participant info
        const participant = session.participants.find((p) => p.id === participantId);
        if (participant && update.cursor) {
          participant.cursor = update.cursor;
        }
        if (participant && update.selection) {
          participant.selection = update.selection;
        }
      }
      return new Map(sessions);
    });

    // Dispatch event for UI updates
    window.dispatchEvent(
      new CustomEvent('collaborative-update', {
        detail: { sessionId, update, participantId },
      })
    );
  }

  /**
   * Backup user data
   */
  public async backupUserData(): Promise<void> {
    const userData = {
      preferences: this.userProfile()?.preferences,
      localData: this.getAllLocalData(),
      timestamp: new Date(),
    };

    try {
      await this.http
        .post(`${this.API_BASE}/user/backup`, userData, { headers: this.getAuthHeaders() })
        .toPromise();

      console.log('User data backed up successfully');
    } catch (error) {
      console.error('Failed to backup user data:', error);
      throw error;
    }
  }

  /**
   * Restore user data
   */
  public async restoreUserData(backupId?: string): Promise<void> {
    try {
      const url = backupId
        ? `${this.API_BASE}/user/backup/${backupId}`
        : `${this.API_BASE}/user/backup/latest`;

      const backup = await this.http.get<any>(url, { headers: this.getAuthHeaders() }).toPromise();

      if (backup) {
        // Restore preferences
        if (backup.preferences) {
          await this.syncPreferences(backup.preferences);
        }

        // Restore local data
        if (backup.localData) {
          this.restoreLocalData(backup.localData);
        }

        console.log('User data restored successfully');
      }
    } catch (error) {
      console.error('Failed to restore user data:', error);
      throw error;
    }
  }

  /**
   * Export user data
   */
  public async exportUserData(): Promise<Blob> {
    try {
      const response = await this.http
        .get(`${this.API_BASE}/user/export`, {
          headers: this.getAuthHeaders(),
          responseType: 'blob',
        })
        .toPromise();

      return response!;
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * Import user data
   */
  public async importUserData(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await this.http
        .post(`${this.API_BASE}/user/import`, formData, { headers: this.getAuthHeaders() })
        .toPromise();

      // Refresh user profile
      await this.refreshProfile();

      console.log('User data imported successfully');
    } catch (error) {
      console.error('Failed to import user data:', error);
      throw error;
    }
  }

  /**
   * Setup auto-sync
   */
  private setupAutoSync(): void {
    this.autoSyncSubscription = interval(this.autoSyncInterval)
      .pipe(
        switchMap(() => {
          if (this.isOnline() && this.userProfile()) {
            return from(this.syncPreferences());
          }
          return of(null);
        }),
        catchError((error) => {
          console.error('Auto-sync failed:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Process pending sync queue
   */
  private async processPendingQueue(): Promise<void> {
    const queue = this.pendingQueue();
    if (queue.length === 0) return;

    this.updateSyncStatus({ isSyncing: true });

    for (const item of queue) {
      try {
        switch (item.type) {
          case 'preferences':
            await this.syncPreferences(item.data);
            break;

          case 'collaborative_update':
            this.sendCollaborativeUpdate(item.sessionId, item.data);
            break;

          default:
            console.log('Unknown queue item type:', item.type);
        }

        // Remove from queue
        this.pendingQueue.update((q) => q.filter((i) => i !== item));
      } catch (error) {
        console.error('Failed to process queue item:', error);
      }
    }

    this.updateSyncStatus({ isSyncing: false });
  }

  /**
   * Queue data for sync when online
   */
  private queueForSync(data: any): void {
    this.pendingQueue.update((queue) => [
      ...queue,
      {
        ...data,
        timestamp: new Date(),
      },
    ]);

    this.updateSyncStatus({
      pendingChanges: this.pendingQueue().length,
    });
  }

  /**
   * Broadcast to other devices
   */
  private broadcastToOtherDevices(type: string, data: any): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({
          type: 'broadcast',
          eventType: type,
          data,
          deviceId: this.getDeviceId(),
        })
      );
    }
  }

  /**
   * Handle remote preference update
   */
  private handleRemotePreferenceUpdate(preferences: UserPreferences): void {
    this.userProfile.update((profile) =>
      profile
        ? {
            ...profile,
            preferences,
          }
        : null
    );

    // Apply preferences locally
    this.applyPreferences(preferences);

    // Notify UI
    window.dispatchEvent(
      new CustomEvent('remote-preference-update', {
        detail: preferences,
      })
    );
  }

  /**
   * Apply preferences locally
   */
  private applyPreferences(preferences: UserPreferences): void {
    // Save to local storage
    this.saveToLocalStorage('user_preferences', preferences);

    // Apply theme
    if (preferences.theme) {
      document.documentElement.setAttribute('data-theme', preferences.theme.mode);
      document.documentElement.style.setProperty('--primary-color', preferences.theme.primaryColor);
      document.documentElement.style.setProperty(
        '--secondary-color',
        preferences.theme.secondaryColor
      );
    }

    // Apply language
    if (preferences.language) {
      document.documentElement.lang = preferences.language;
    }

    // Apply accessibility
    if (preferences.accessibility) {
      document.documentElement.classList.toggle(
        'reduced-motion',
        preferences.accessibility.reducedMotion
      );
      document.documentElement.classList.toggle(
        'high-contrast',
        preferences.accessibility.highContrast
      );
    }
  }

  // Utility methods

  private handleOnline(): void {
    this.isOnline.set(true);
    this.connectWebSocket();
    this.processPendingQueue();
  }

  private handleOffline(): void {
    this.isOnline.set(false);
  }

  private handleWebSocketReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connectWebSocket(), 5000 * this.reconnectAttempts);
    }
  }

  private handleDeviceSync(data: any): void {
    console.log('Device sync:', data);
  }

  private handleCloudNotification(data: any): void {
    console.log('Cloud notification:', data);
  }

  private subscribeToChannels(): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({
          type: 'subscribe',
          channels: ['preferences', 'devices', 'notifications'],
        })
      );
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private saveAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private getDeviceId(): string {
    return localStorage.getItem('device_id') || '';
  }

  private saveDeviceId(id: string): void {
    localStorage.setItem('device_id', id);
  }

  private loadCachedPreferences(): void {
    const cached = localStorage.getItem('user_preferences');
    if (cached) {
      try {
        const preferences = JSON.parse(cached);
        this.applyPreferences(preferences);
      } catch (error) {
        console.error('Failed to load cached preferences:', error);
      }
    }
  }

  private saveToLocalStorage(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to local storage:', error);
    }
  }

  private getAllLocalData(): Record<string, any> {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('auth_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  }

  private restoreLocalData(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      this.saveToLocalStorage(key, value);
    });
  }

  private updateSyncStatus(update: Partial<SyncStatus>): void {
    this.syncStatus.update((status) => ({ ...status, ...update }));
  }

  private async refreshProfile(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      await this.authenticate(token);
    }
  }

  private getDeviceName(): string {
    return `${this.getBrowser()} on ${this.getOS()}`;
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  /**
   * Cleanup
   */
  public ngOnDestroy(): void {
    if (this.autoSyncSubscription) {
      this.autoSyncSubscription.unsubscribe();
    }

    if (this.websocket) {
      this.websocket.close();
    }
  }
}
