import { Injectable } from '@nestjs/common';

export interface SeriesPoint { date: string; value: number }

@Injectable()
export class ForecastingService {
  async predict(history: SeriesPoint[], horizon: number): Promise<SeriesPoint[]> {
    const avg = history.length ? history.reduce((a, b) => a + b.value, 0) / history.length : 0;
    return Array.from({ length: horizon }, (_, i) => ({
      date: new Date(Date.now() + i * 86_400_000).toISOString().slice(0, 10),
      value: avg,
    }));
  }
}
