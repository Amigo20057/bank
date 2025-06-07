import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
    public constructor(private readonly gateway: NotificationGateway) {}
    @RabbitSubscribe({
        exchange: 'transaction-exchange',
        routingKey: 'transaction.created',
        queue: 'notification.transaction.created',
    })
    async handleTransactionCreated(payload: any) {
        console.log('📬 Нова транзакція:', payload);

        this.gateway.sendTransactionNotification(payload);
    }
}
