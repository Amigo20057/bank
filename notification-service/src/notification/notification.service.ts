import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
    @RabbitSubscribe({
        exchange: 'transaction-exchange',
        routingKey: 'transaction.created',
        queue: 'notification.transaction.created',
    })
    async handleTransactionCreated(payload: any) {
        console.log('📬 Нова транзакція:', payload);

        // Надсилання email, push або логіка нотифікації
    }
}
