import { Injectable } from '@nestjs/common';
type Handler = (payload: unknown) => void | Promise<void>;
@Injectable()
export class EventBusService {
  private subs = new Map<string, Handler[]>();
  on(event: string, h: Handler) { const a = this.subs.get(event) ?? []; a.push(h); this.subs.set(event, a); }
  async emit(event: string, payload: unknown) {
    const hs = this.subs.get(event) ?? [];
    await Promise.all(hs.map((h) => h(payload)));
  }
}
