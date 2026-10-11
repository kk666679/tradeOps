export type FsmState = 'idle'|'planning'|'running'|'waiting_approval'|'done'|'failed';
export class Fsm {
  private state: FsmState = 'idle';
  get(): FsmState { return this.state; }
  set(s: FsmState) { this.state = s; }
}
