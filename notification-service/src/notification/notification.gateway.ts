import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotificationGateway {
    @WebSocketServer()
    server: Server;

    sendTransactionNotification(data: any) {
        this.server.emit('transaction', data);
    }
}
