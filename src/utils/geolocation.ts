// Geolocation utilities
export interface GeolocationError {
  code: number;
  message: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export class GeolocationService {
  private static instance: GeolocationService;
  private watchId: number | null = null;

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  // Get current position with enhanced error handling
  async getCurrentPosition(options?: PositionOptions): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject({
          code: 0,
          message: 'Geolocation API desteklenmiyor'
        } as GeolocationError);
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5 * 60 * 1000, // 5 minutes
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          const errorMessages: Record<number, string> = {
            1: 'Konum izni reddedildi',
            2: 'Konum bilgisi alınamadı',
            3: 'Konum alma zaman aşımı'
          };

          reject({
            code: error.code,
            message: errorMessages[error.code] || 'Bilinmeyen konum hatası'
          } as GeolocationError);
        },
        defaultOptions
      );
    });
  }

  // Watch position changes
  watchPosition(
    onSuccess: (coordinates: LocationCoordinates) => void,
    onError: (error: GeolocationError) => void,
    options?: PositionOptions
  ): number | null {
    if (!this.isSupported()) {
      onError({
        code: 0,
        message: 'Geolocation API desteklenmiyor'
      });
      return null;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000, // 1 minute
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        const errorMessages: Record<number, string> = {
          1: 'Konum izni reddedildi',
          2: 'Konum bilgisi alınamadı',
          3: 'Konum alma zaman aşımı'
        };

        onError({
          code: error.code,
          message: errorMessages[error.code] || 'Bilinmeyen konum hatası'
        });
      },
      defaultOptions
    );

    return this.watchId;
  }

  // Stop watching position
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Check permission status (if supported)
  async checkPermission(): Promise<PermissionState | 'unsupported'> {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state;
      } catch (error) {
        console.warn('Permission API not supported:', error);
      }
    }
    return 'unsupported';
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();