import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow the frontend URL
    credentials: true, // Allow cookies if needed
  },
})
//@WebSocketGateway(80, { namespace: 'chat' })
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMEssage(payload: { sender: string; message: string }): void {
    console.log('Received message:', payload);
    this.server.emit('message', payload);
  }
}
