// backend/mcp/servers/tradeops/src/metrics.ts

interface Counter { name: string; help: string; labels: Record<string, number>; }
interface Histogram { name: string; help: string; buckets: number[]; observations: number[]; }

class MetricRegistry {
  private counters = new Map<string, Counter>();
  private histograms = new Map<string, Histogram>();

  counter(name: string, help: string, labels: Record<string, string> = {}): void {
    const key = name + JSON.stringify(labels);
    if (!this.counters.has(key)) {
      this.counters.set(key, { name, help, labels: {} });
    }
    const c = this.counters.get(key)!;
    const lk = Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(",") || "_";
    c.labels[lk] = (c.labels[lk] ?? 0) + 1;
  }

  observe(name: string, help: string, value: number, buckets = [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]): void {
    let h = this.histograms.get(name);
    if (!h) {
      h = { name, help, buckets, observations: [] };
      this.histograms.set(name, h);
    }
    h.observations.push(value);
  }

  render(): string {
    const lines: string[] = [];
    for (const c of this.counters.values()) {
      lines.push(`# HELP ${c.name} ${c.help}`);
      lines.push(`# TYPE ${c.name} counter`);
      for (const [labels, value] of Object.entries(c.labels)) {
        lines.push(`${c.name}{${labels === "_" ? "" : labels}} ${value}`);
      }
    }
    for (const h of this.histograms.values()) {
      lines.push(`# HELP ${h.name} ${h.help}`);
      lines.push(`# TYPE ${h.name} histogram`);
      const sum = h.observations.reduce((a, b) => a + b, 0);
      lines.push(`${h.name}_sum ${sum}`);
      lines.push(`${h.name}_count ${h.observations.length}`);
    }
    return lines.join("\n") + "\n";
  }
}

export const metrics = new MetricRegistry();
