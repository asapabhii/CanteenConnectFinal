import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // We'll use a map to track which user belongs to which socket
  private connectedUsers: Map<string, string> = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remove user from our map on disconnect
    this.connectedUsers.forEach((value, key) => {
      if (value === client.id) {
        this.connectedUsers.delete(key);
      }
    });
    console.log(`Client disconnected: ${client.id}`);
  }

  // When a user logs in on the frontend, they'll send this message
  @SubscribeMessage('authenticate')
  handleAuthentication(client: Socket, userId: string) {
    this.connectedUsers.set(userId, client.id);
    client.join(userId); // Have the client join a room named after their userId
    console.log(`User ${userId} authenticated and joined their room.`);
  }

  @SubscribeMessage('joinOutletRoom')
  handleJoinRoom(client: Socket, outletId: string) {
    client.join(outletId);
    console.log(`Client ${client.id} joined room for outlet ${outletId}`);
  }
}
