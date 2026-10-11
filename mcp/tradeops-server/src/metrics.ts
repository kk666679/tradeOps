/**
 * Minimal Prometheus-style metrics registry.
 *
 * No external dependency — counters and a histogram bucket set are enough to
 * satisfy the observability contract. `render()` produces the text exposition
 * format served from `GET /metrics`.
 */

type Labels = Record<string, string | number>;

function labelKey(labels?: Labels): string {
  if (!labels) return '';
  const keys = Object.keys(labels).sort();
  if (keys.length === 0) return '';
  return keys.map((k) => `${k}="${String(labels[k]).replace(/"/g, '\\"')}"`).join(',');
}

interface Counter {
  type: 'counter';
  help: string;
  values: Map<string, number>;
}
interface Gauge {
  type: 'gauge';
  help: string;
  values: Map<string, number>;
}
interface Histogram {
  type: 'histogram';
  help: string;
  buckets: number[];
  counts: Map<string, number[]>; // labelKey -> [le counts..., +Inf count]
  sums: Map<string, number>;
}

type Metric = Counter | Gauge | Histogram;

export class MetricsRegistry {
  private metrics = new Map<string, Metric>();

  counter(name: string, help: string): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, { type: 'counter', help, values: new Map() });
    }
  }

  gauge(name: string, help: string): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, { type: 'gauge', help, values: new Map() });
    }
  }

  histogram(name: string, help: string, buckets: number[]): void {
    if (!this.metrics.has(name)) {
      const sorted = [...buckets].sort((a, b) => a - b);
      this.metrics.set(name, {
        type: 'histogram',
        help,
        buckets: sorted,
        counts: new Map(),
        sums: new Map(),
      });
    }
  }

  inc(name: string, labels?: Labels, by = 1): void {
    const m = this.metrics.get(name) as Counter | undefined;
    if (!m) return;
    const k = labelKey(labels);
    m.values.set(k, (m.values.get(k) ?? 0) + by);
  }

  setGauge(name: string, value: number, labels?: Labels): void {
    const m = this.metrics.get(name) as Gauge | undefined;
    if (!m) return;
    m.values.set(labelKey(labels), value);
  }

  incGauge(name: string, by = 1, labels?: Labels): void {
    const m = this.metrics.get(name) as Gauge | undefined;
    if (!m) return;
    const k = labelKey(labels);
    m.values.set(k, (m.values.get(k) ?? 0) + by);
  }

  decGauge(name: string, by = 1, labels?: Labels): void {
    const m = this.metrics.get(name) as Gauge | undefined;
    if (!m) return;
    const k = labelKey(labels);
    m.values.set(k, (m.values.get(k) ?? 0) - by);
  }

  observe(name: string, value: number, labels?: Labels): void {
    const m = this.metrics.get(name) as Histogram | undefined;
    if (!m) return;
    const k = labelKey(labels);
    const counts = m.counts.get(k) ?? new Array(m.buckets.length + 1).fill(0);
    let placed = false;
    for (let i = 0; i < m.buckets.length; i++) {
      if (value <= m.buckets[i]) {
        counts[i] += 1;
        placed = true;
        break;
      }
    }
    if (!placed) counts[m.buckets.length] += 1; // +Inf
    m.counts.set(k, counts);
    m.sums.set(k, (m.sums.get(k) ?? 0) + value);
  }

  /** Render all metrics in Prometheus text exposition format. */
  render(): string {
    const lines: string[] = [];
    for (const [name, m] of this.metrics) {
      lines.push(`# HELP ${name} ${m.help}`);
      lines.push(`# TYPE ${name} ${m.type}`);
      if (m.type === 'histogram') {
        for (const [k, counts] of m.counts) {
          let cumulative = 0;
          for (let i = 0; i < m.buckets.length; i++) {
            cumulative += counts[i];
            const lbl = k ? `{le="${m.buckets[i]}",${k}}` : `le="${m.buckets[i]}"`;
            lines.push(`${name}_bucket${lbl} ${cumulative}`);
          }
          const infLbl = k ? `{le="+Inf",${k}}` : `le="+Inf"`;
          lines.push(`${name}_bucket${infLbl} ${counts[m.buckets.length]}`);
          const cntLbl = k ? `{${k}}` : '';
          lines.push(`${name}_count${cntLbl} ${counts.reduce((a, b) => a + b, 0)}`);
          lines.push(`${name}_sum${cntLbl} ${m.sums.get(k) ?? 0}`);
        }
      } else {
        for (const [k, v] of m.values) {
          lines.push(`${name}${k ? `{${k}}` : ''} ${v}`);
        }
      }
    }
    return lines.join('\n') + '\n';
  }

  /** Reset all values (used in tests). */
  reset(): void {
    for (const m of this.metrics.values()) {
      if (m.type === 'histogram') {
        m.counts.clear();
        m.sums.clear();
      } else {
        m.values.clear();
      }
    }
  }
}

/** Register the canonical metric names required by the observability contract. */
export function registerDefaultMetrics(reg: MetricsRegistry): void {
  reg.counter('mcp_tool_calls_total', 'Total MCP tool invocations by tool and status.');
  reg.counter('iot_telemetry_total', 'Accepted/rejected IoT telemetry posts by device type and status.');
  reg.counter('ledger_appends_total', 'Total ledger append operations by status.');
  reg.histogram('ledger_append_duration_ms', 'Ledger append latency in milliseconds.', [
    1, 5, 10, 25, 50, 100, 250, 500, 1000,
  ]);
  reg.gauge('sse_clients_connected', 'Currently connected SSE subscribers.');
}

/** Process-wide singleton metrics registry. */
export const metrics = new MetricsRegistry();
registerDefaultMetrics(metrics);
