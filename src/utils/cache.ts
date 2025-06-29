// Advanced caching system
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100;

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const cache = new Cache();

// Persistent cache using localStorage
export class PersistentCache {
  private prefix: string;
  
  constructor(prefix: string = 'app-cache') {
    this.prefix = prefix;
  }

  set<T>(key: string, data: T, ttlMs: number = 24 * 60 * 60 * 1000): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttlMs
      };
      
      localStorage.setItem(`${this.prefix}-${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting persistent cache:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(`${this.prefix}-${key}`);
      if (!stored) return null;
      
      const item: CacheItem<T> = JSON.parse(stored);
      
      if (Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Error getting persistent cache:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}-${key}`);
    } catch (error) {
      console.error('Error removing persistent cache:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${this.prefix}-`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing persistent cache:', error);
    }
  }
}

export const persistentCache = new PersistentCache('global-news');