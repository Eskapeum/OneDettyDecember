import { logger } from './logger'

interface CacheOptions {
  ttl: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
}

interface CacheEntry<T> {
  data: T
  expiry: number
  tags: string[]
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private readonly MAX_CACHE_SIZE = 1000 // Prevent memory leaks

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      logger.debug('Cache miss (expired)', {
        action: 'cache_miss',
        metadata: { key, reason: 'expired' },
      })
      return null
    }

    logger.debug('Cache hit', {
      action: 'cache_hit',
      metadata: { key },
    })

    return entry.data as T
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, data: T, options: CacheOptions): void {
    // Check cache size limit
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest()
    }

    const expiry = Date.now() + options.ttl * 1000

    this.cache.set(key, {
      data,
      expiry,
      tags: options.tags || [],
    })

    logger.debug('Cache set', {
      action: 'cache_set',
      metadata: { key, ttl: options.ttl },
    })
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
    logger.debug('Cache deleted', {
      action: 'cache_delete',
      metadata: { key },
    })
  }

  /**
   * Clear all cache entries with a specific tag
   */
  invalidateByTag(tag: string): void {
    let count = 0

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key)
        count++
      }
    }

    logger.info(`Cache invalidated by tag: ${tag}`, {
      action: 'cache_invalidate_tag',
      metadata: { tag, count },
    })
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    logger.info('Cache cleared', {
      action: 'cache_clear',
      metadata: { entriesRemoved: size },
    })
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      utilization: (this.cache.size / this.MAX_CACHE_SIZE) * 100,
    }
  }

  /**
   * Evict oldest entry when cache is full
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestExpiry = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < oldestExpiry) {
        oldestExpiry = entry.expiry
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      logger.debug('Cache evicted', {
        action: 'cache_evict',
        metadata: { key: oldestKey },
      })
    }
  }
}

// Export singleton
export const cacheManager = new CacheManager()

/**
 * Cache wrapper function for async operations
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  // Try to get from cache first
  const cached = cacheManager.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()

  // Store in cache
  cacheManager.set(key, data, options)

  return data
}

/**
 * Predefined cache TTLs
 */
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
}

/**
 * Cache tags for organized invalidation
 */
export const CacheTags = {
  PACKAGES: 'packages',
  BOOKINGS: 'bookings',
  USER: 'user',
  VENDOR: 'vendor',
  REVIEWS: 'reviews',
  WISHLIST: 'wishlist',
  STATS: 'stats',
}
