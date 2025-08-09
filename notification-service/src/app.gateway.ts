import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() userId: string) {
    // join user to a room
    this.server.socketsJoin(userId);
  }
}
