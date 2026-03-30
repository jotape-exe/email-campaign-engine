import { MessagePublisher } from "@/application/ports/message-publisher.repository";
import { RabbitMQConnection } from "../connection/rabbitmq-connection";
import { EmailQueue } from "../queues/email.queue";

export class RabbitMQPublisher implements MessagePublisher {
    async publish(queue: string, message: any) {
        const conn = await RabbitMQConnection.getInstance();
        const channel = conn.getChannel();

        await channel.assertExchange(EmailQueue.exchange, "direct", {
            durable: true,
        });

        channel.publish(
            EmailQueue.exchange,
            queue,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );
    }
}