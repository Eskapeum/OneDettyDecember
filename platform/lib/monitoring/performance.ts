/**
 * Performance Monitoring
 * 
 * Tracks and reports performance metrics:
 * - API response times
 * - Database query times
 * - Cache hit rates
 * - Search performance
 * 
 * @author Amelia (Lead Dev)
 * @sprint Sprint 2
 */

import { cache } from '@/lib/redis';

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private static readonly METRICS_KEY_PREFIX = 'metrics:';
  private static readonly METRICS_TTL = 3600; // 1 hour

  /**
   * Track a performance metric
   */
  static async track(metric: PerformanceMetric): Promise<void> {
    try {
      const key = `${this.METRICS_KEY_PREFIX}${metric.name}:${Date.now()}`;
      await cache.set(key, metric, this.METRICS_TTL);

      // Log slow operations
      if (metric.duration > 1000) {
        console.warn(`⚠️  Slow operation: ${metric.name} took ${metric.duration}ms`, metric.metadata);
      }
    } catch (error) {
      console.error('Performance tracking error:', error);
    }
  }

  /**
   * Track API request
   */
  static async trackRequest(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number
  ): Promise<void> {
    await this.track({
      name: 'api_request',
      duration,
      timestamp: Date.now(),
      metadata: {
        endpoint,
        method,
        statusCode,
      },
    });
  }

  /**
   * Track database query
   */
  static async trackQuery(
    query: string,
    duration: number,
    rowCount?: number
  ): Promise<void> {
    await this.track({
      name: 'db_query',
      duration,
      timestamp: Date.now(),
      metadata: {
        query: query.substring(0, 100), // Truncate long queries
        rowCount,
      },
    });
  }

  /**
   * Track cache operation
   */
  static async trackCache(
    operation: 'get' | 'set' | 'del',
    hit: boolean,
    duration: number
  ): Promise<void> {
    await this.track({
      name: 'cache_operation',
      duration,
      timestamp: Date.now(),
      metadata: {
        operation,
        hit,
      },
    });
  }

  /**
   * Track search performance
   */
  static async trackSearch(
    query: string,
    resultCount: number,
    duration: number,
    cached: boolean
  ): Promise<void> {
    await this.track({
      name: 'search',
      duration,
      timestamp: Date.now(),
      metadata: {
        query: query.substring(0, 50),
        resultCount,
        cached,
      },
    });
  }

  /**
   * Get performance summary
   */
  static async getSummary(metricName: string, minutes: number = 60): Promise<{
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    p95Duration: number;
  }> {
    try {
      const pattern = `${this.METRICS_KEY_PREFIX}${metricName}:*`;
      const keys = await cache.get<string[]>(pattern);
      
      if (!keys || keys.length === 0) {
        return {
          count: 0,
          avgDuration: 0,
          minDuration: 0,
          maxDuration: 0,
          p95Duration: 0,
        };
      }

      // Get all metrics
      const metrics: PerformanceMetric[] = [];
      for (const key of keys) {
        const metric = await cache.get<PerformanceMetric>(key);
        if (metric) {
          metrics.push(metric);
        }
      }

      // Filter by time window
      const cutoff = Date.now() - minutes * 60 * 1000;
      const recentMetrics = metrics.filter((m) => m.timestamp >= cutoff);

      if (recentMetrics.length === 0) {
        return {
          count: 0,
          avgDuration: 0,
          minDuration: 0,
          maxDuration: 0,
          p95Duration: 0,
        };
      }

      // Calculate statistics
      const durations = recentMetrics.map((m) => m.duration).sort((a, b) => a - b);
      const sum = durations.reduce((a, b) => a + b, 0);
      const p95Index = Math.floor(durations.length * 0.95);

      return {
        count: recentMetrics.length,
        avgDuration: sum / recentMetrics.length,
        minDuration: durations[0],
        maxDuration: durations[durations.length - 1],
        p95Duration: durations[p95Index],
      };
    } catch (error) {
      console.error('Performance summary error:', error);
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p95Duration: 0,
      };
    }
  }
}

/**
 * Performance timer utility
 */
export class PerformanceTimer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = Date.now();
  }

  /**
   * End timer and track metric
   */
  async end(metadata?: Record<string, any>): Promise<number> {
    const duration = Date.now() - this.startTime;
    await PerformanceMonitor.track({
      name: this.name,
      duration,
      timestamp: Date.now(),
      metadata,
    });
    return duration;
  }
}

