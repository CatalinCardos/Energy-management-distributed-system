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
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-chat/user')
  handleJoinChat(@MessageBody() data: any, @ConnectedSocket() client: any) {
    this.server.emit('join-chat/admin', data);
  }

  @SubscribeMessage('join-chat/admin')
  handleJoinChatAdmin(@ConnectedSocket() client: any) {
    this.server.emit('join-chat/admin/to-users');
  }

  @SubscribeMessage('send-message')
  handleMessageUser(@MessageBody() data: any, @ConnectedSocket() client: any) {
    this.server.emit(`messageToUser/user/${data.roomId}${data.toUser}`, data);
  }

  @SubscribeMessage('message')
  handleConnection(@ConnectedSocket() client: any) {
    console.log('Websocket connected with id: ' + client.id);
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    this.server.emit(`leave-chat/admin`, {clientID: client.id});
    console.log('Websocket disconnected with id: ' + client.id);
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: any, @ConnectedSocket() client: any) {
    this.server.emit(`typing/user/${data.roomId}${data.toUser}`, data);
  }

  @SubscribeMessage('seen-message')
  handleSeenMessage(@MessageBody() data: any, @ConnectedSocket() client: any) {
    this.server.emit(`seen-message/user/${data.roomId}${data.toUser}`, data);
  }

  @SubscribeMessage('unseen-message')
  handleUnseenMessage(@MessageBody() data: any, @ConnectedSocket() client: any) {
    this.server.emit(`unseen-message/user/${data.roomId}${data.toUser}`, data);
  }

}
