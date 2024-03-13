import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class AlertGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('alert')
  sendAlert(
    @MessageBody() data: { deviceId: number; hourlyConsumption: number },
  ) {
    console.log('alert');
    this.server.emit('alert', data);
  }

  @SubscribeMessage('message')
  handleConnection(@ConnectedSocket() client: any) {
    console.log('Websocket connected');
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    console.log('Websocket disconnected');
  }
}
