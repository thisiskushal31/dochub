/**
 * Cache utility for GitHub API responses
 * Uses localStorage to cache file tree and markdown content
 */

const CACHE_PREFIX = 'dochub_cache_';
const CACHE_VERSION = '1.0';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes for file tree
const MARKDOWN_TTL = 10 * 60 * 1000; // 10 minutes for markdown content

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

/**
 * Get cache key for a specific resource
 */
function getCacheKey(type: string, repoId: string, path: string = ''): string {
  return `${CACHE_PREFIX}${type}_${repoId}_${path}`;
}

/**
 * Get cached data if it exists and is not expired
 */
export function getCached<T>(type: string, repoId: string, path: string = ''): T | null {
  try {
    const key = getCacheKey(type, repoId, path);
    const cached = localStorage.getItem(key);
    
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    
    // Check version
    if (entry.version !== CACHE_VERSION) {
      localStorage.removeItem(key);
      return null;
    }
    
    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Set cached data with TTL
 */
export function setCached<T>(
  type: string,
  repoId: string,
  data: T,
  ttl: number = DEFAULT_TTL,
  path: string = ''
): void {
  try {
    const key = getCacheKey(type, repoId, path);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      version: CACHE_VERSION,
    };
    
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Cache storage quota exceeded, clearing old entries');
      clearOldCache();
      // Retry once
      try {
        const key = getCacheKey(type, repoId, path);
        const entry: CacheEntry<T> = {
          data,
          timestamp: Date.now(),
          ttl,
          version: CACHE_VERSION,
        };
        localStorage.setItem(key, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    } else {
      console.error('Error writing to cache:', error);
    }
  }
}

/**
 * Clear expired cache entries
 */
function clearOldCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry<unknown> = JSON.parse(cached);
            if (now - entry.timestamp > entry.ttl || entry.version !== CACHE_VERSION) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
}

/**
 * Clear all cache for a specific repository
 */
export function clearCache(repoId: string): void {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX) && key.includes(`_${repoId}_`)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { count: number; size: number } {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    let totalSize = 0;
    
    for (const key of keys) {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    }
    
    return {
      count: keys.length,
      size: totalSize,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { count: 0, size: 0 };
  }
}

export { DEFAULT_TTL, MARKDOWN_TTL };

