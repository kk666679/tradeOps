import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/clearance', cors: true })
export class ClearanceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private log = new Logger(ClearanceGateway.name);

  handleConnection(client: Socket) { this.log.log('connected ' + client.id); }
  handleDisconnect(client: Socket) { this.log.log('disconnected ' + client.id); }

  @SubscribeMessage('ping')
  ping(@org() _client: Socket, payload: unknown) { return { ok: true, echo: payload }; }
}
function org() { return (_t: unknown, _k: string, i: number) => { void i; }; }
