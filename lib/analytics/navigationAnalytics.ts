/**
 * Navigation Analytics Service
 * Tracks user navigation patterns, route usage, and performance metrics
 * 
 * Features:
 * - Route tracking
 * - Visit duration measurement
 * - User path analysis
 * - Metrics export
 * - Privacy-focused (no PII)
 */

export interface NavigationEvent {
  type: 'route_change' | 'menu_open' | 'search' | 'bookmark';
  route: string;
  timestamp: number;
  duration?: number;
  userAgent: string;
  sessionId: string;
}

export interface RouteMetrics {
  route: string;
  visits: number;
  totalDuration: number;
  avgDuration: number;
  lastVisited: number;
  bounceRate?: number;
}

export interface AnalyticsData {
  sessionId: string;
  startTime: number;
  events: NavigationEvent[];
  metrics: Map<string, RouteMetrics>;
}

/**
 * Navigation Analytics Tracker
 * Singleton instance for tracking navigation events
 */
class NavigationAnalytics {
  private static instance: NavigationAnalytics;
  private data: AnalyticsData;
  private routeStartTime: number = 0;
  private previousRoute: string = '';
  private enabled: boolean = true;

  private constructor() {
    this.data = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      events: [],
      metrics: new Map(),
    };

    this.loadFromStorage();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): NavigationAnalytics {
    if (!NavigationAnalytics.instance) {
      NavigationAnalytics.instance = new NavigationAnalytics();
    }
    return NavigationAnalytics.instance;
  }

  /**
   * Track route change
   */
  trackRouteChange(route: string): void {
    if (!this.enabled || typeof window === 'undefined') return;

    // Record duration of previous route
    if (this.previousRoute && this.routeStartTime > 0) {
      const duration = Date.now() - this.routeStartTime;
      this.recordEvent({
        type: 'route_change',
        route: this.previousRoute,
        timestamp: Date.now(),
        duration,
        userAgent: navigator.userAgent,
        sessionId: this.data.sessionId,
      });
      this.updateMetrics(this.previousRoute, duration);
    }

    // Start tracking new route
    this.previousRoute = route;
    this.routeStartTime = Date.now();

    // Ensure route metrics exist
    if (!this.data.metrics.has(route)) {
      this.data.metrics.set(route, {
        route,
        visits: 0,
        totalDuration: 0,
        avgDuration: 0,
        lastVisited: Date.now(),
      });
    }

    // Increment visit count
    const metrics = this.data.metrics.get(route)!;
    metrics.visits += 1;
    metrics.lastVisited = Date.now();

    this.saveToStorage();
  }

  /**
   * Track menu interaction
   */
  trackMenuOpen(menuName: string): void {
    if (!this.enabled || typeof window === 'undefined') return;

    this.recordEvent({
      type: 'menu_open',
      route: menuName,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.data.sessionId,
    });

    this.saveToStorage();
  }

  /**
   * Track search action
   */
  trackSearch(query: string): void {
    if (!this.enabled || typeof window === 'undefined') return;

    this.recordEvent({
      type: 'search',
      route: `search:${query}`,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.data.sessionId,
    });

    this.saveToStorage();
  }

  /**
   * Track bookmark action
   */
  trackBookmark(route: string): void {
    if (!this.enabled || typeof window === 'undefined') return;

    this.recordEvent({
      type: 'bookmark',
      route,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.data.sessionId,
    });

    this.saveToStorage();
  }

  /**
   * Get top visited routes
   */
  getTopRoutes(limit: number = 10): RouteMetrics[] {
    return Array.from(this.data.metrics.values())
      .sort((a, b) => b.visits - a.visits)
      .slice(0, limit);
  }

  /**
   * Get route metrics
   */
  getRouteMetrics(route: string): RouteMetrics | undefined {
    return this.data.metrics.get(route);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): RouteMetrics[] {
    return Array.from(this.data.metrics.values());
  }

  /**
   * Get session duration in seconds
   */
  getSessionDuration(): number {
    return Math.floor((Date.now() - this.data.startTime) / 1000);
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.data.sessionId;
  }

  /**
   * Export analytics as JSON
   */
  export(): Record<string, any> {
    return {
      sessionId: this.data.sessionId,
      startTime: this.data.startTime,
      duration: this.getSessionDuration(),
      eventCount: this.data.events.length,
      metrics: Array.from(this.data.metrics.values()),
      topRoutes: this.getTopRoutes(10),
    };
  }

  /**
   * Send analytics to server
   */
  async sendToServer(endpoint: string = '/api/analytics'): Promise<void> {
    try {
      const payload = this.export();
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  /**
   * Clear all analytics data
   */
  clear(): void {
    this.data = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      events: [],
      metrics: new Map(),
    };
    localStorage.removeItem('nav-analytics');
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Private methods
   */

  private recordEvent(event: NavigationEvent): void {
    this.data.events.push(event);
    // Keep only last 1000 events to prevent memory bloat
    if (this.data.events.length > 1000) {
      this.data.events.shift();
    }
  }

  private updateMetrics(route: string, duration: number): void {
    const metrics = this.data.metrics.get(route);
    if (!metrics) return;

    metrics.totalDuration += duration;
    metrics.avgDuration = Math.round(metrics.totalDuration / metrics.visits);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        sessionId: this.data.sessionId,
        startTime: this.data.startTime,
        metrics: Array.from(this.data.metrics.entries()),
      };
      localStorage.setItem('nav-analytics', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save analytics:', e);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('nav-analytics');
      if (!stored) return;

      const data = JSON.parse(stored);
      this.data.sessionId = data.sessionId;
      this.data.startTime = data.startTime;

      // Restore metrics
      if (data.metrics && Array.isArray(data.metrics)) {
        data.metrics.forEach(([key, value]: [string, RouteMetrics]) => {
          this.data.metrics.set(key, value);
        });
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
  }
}

/**
 * Export singleton instance
 */
export const analyticsTracker = NavigationAnalytics.getInstance();

/**
 * React hook for tracking route changes
 */
export function useNavigationTracking(): void {
  const React = require('react');
  
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Extract route from full URL
      const [route = ''] = url.split(/[?#]/, 1);
      analyticsTracker.trackRouteChange(route);
    };

    // Track initial route
    if (typeof window !== 'undefined') {
      handleRouteChange(window.location.pathname);
    }

    // Note: This would need to be integrated with Next.js router
    // For now, this is handled in the layout component
  }, []);
}
