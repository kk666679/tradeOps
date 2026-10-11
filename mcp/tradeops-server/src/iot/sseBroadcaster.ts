/**
 * SSE broadcaster for real-time zone events.
 * Manages per-zone subscriber channels with heartbeat and stale connection cleanup.
 */

import { EventEmitter } from 'node:events';
import type { Response } from 'express';
import { logger } from '../logger.js';

const log = logger.child({ component: 'sseBroadcaster' });

export interface SSEEvent {
  type: string;
  deviceId?: string;
  zoneId: string;
  telemetry?: unknown;
  timestamp: string;
  anomaly?: boolean;
}

export class SSEBroadcaster extends EventEmitter {
  private subscribers = new Map<string, Set<Response>>();
  private heartbeats = new Map<Response, NodeJS.Timeout>();
  private lastActivity = new Map<Response, number>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    super();
    // Run cleanup every 30s
    this.cleanupInterval = setInterval(() => this.cleanupStale(), 30_000);
  }

  /**
   * Subscribe a client to a zone's event stream.
   * Starts 30s heartbeat interval.
   */
  subscribe(zoneId: string, res: Response): void {
    // Initialize zone channel if needed
    if (!this.subscribers.has(zoneId)) {
      this.subscribers.set(zoneId, new Set());
    }

    // Add subscriber
    const subs = this.subscribers.get(zoneId)!;
    subs.add(res);
    this.lastActivity.set(res, Date.now());

    // Configure SSE response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Start heartbeat
    const heartbeat = setInterval(() => this.sendHeartbeat(res), 30_000);
    this.heartbeats.set(res, heartbeat);

    // Handle client disconnect
    res.on('close', () => {
      this.unsubscribe(zoneId, res);
    });

    log.info({ zoneId, subscriberCount: subs.size }, 'SSE client subscribed');
  }

  /**
   * Unsubscribe a client from a zone.
   * Clears heartbeat interval.
   */
  unsubscribe(zoneId: string, res: Response): void {
    const subs = this.subscribers.get(zoneId);
    if (subs) {
      subs.delete(res);
      if (subs.size === 0) {
        this.subscribers.delete(zoneId);
      }
    }

    // Clear heartbeat
    const heartbeat = this.heartbeats.get(res);
    if (heartbeat) {
      clearInterval(heartbeat);
      this.heartbeats.delete(res);
    }

    this.lastActivity.delete(res);
    log.debug({ zoneId }, 'SSE client unsubscribed');
  }

  /**
   * Broadcast an event to all subscribers of a zone.
   */
  broadcast(zoneId: string, event: SSEEvent): void {
    const subs = this.subscribers.get(zoneId);
    if (!subs || subs.size === 0) {
      return;
    }

    const data = JSON.stringify(event);
    for (const res of subs) {
      try {
        res.write(`data: ${data}\n\n`);
        this.lastActivity.set(res, Date.now());
      } catch (err) {
        log.warn({ zoneId, err: String(err) }, 'failed to broadcast to client');
        this.unsubscribe(zoneId, res);
      }
    }

    log.debug({ zoneId, subscriberCount: subs.size, eventType: event.type }, 'broadcasted event');
  }

  /**
   * Send SSE comment as heartbeat.
   */
  private sendHeartbeat(res: Response): void {
    try {
      res.write(': heartbeat\n\n');
      this.lastActivity.set(res, Date.now());
    } catch (err) {
      log.warn({ err: String(err) }, 'heartbeat failed');
      // Cleanup will handle removing stale connection
    }
  }

  /**
   * Remove connections inactive for 30s.
   */
  private cleanupStale(): void {
    const now = Date.now();
    const staleThreshold = 30_000;
    let cleanedCount = 0;

    for (const [res, lastActive] of this.lastActivity.entries()) {
      if (now - lastActive > staleThreshold) {
        // Find and remove from all zones
        for (const [zoneId, subs] of this.subscribers.entries()) {
          if (subs.has(res)) {
            this.unsubscribe(zoneId, res);
            cleanedCount++;
            break;
          }
        }
      }
    }

    if (cleanedCount > 0) {
      log.info({ cleanedCount }, 'cleaned up stale SSE connections');
    }
  }

  /**
   * Shutdown the broadcaster.
   */
  shutdown(): void {
    clearInterval(this.cleanupInterval);
    
    // Close all connections
    for (const [zoneId, subs] of this.subscribers.entries()) {
      for (const res of subs) {
        this.unsubscribe(zoneId, res);
      }
    }
  }
}
