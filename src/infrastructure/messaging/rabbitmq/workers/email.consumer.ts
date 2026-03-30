import { Channel } from "amqplib";
import { EmailHandler } from "./email.handler";

export async function startEmailConsumer(channel: Channel, queueName: string, handler: EmailHandler) {
    channel.consume(queueName, async (msg) => {
        if (!msg) return;

        const content = JSON.parse(msg.content.toString());

        try {
            await handler.handle(content);
            channel.ack(msg);
        } catch (err) {
            console.error("💥 CRITICAL WORKER ERROR", err);
            channel.nack(msg, false, false);
        }
    });
}