import { logger } from "../../../../shared/logger";

import { SendEmailUseCase } from "../../../../application/use-case/email/send-email/send-email.use-case";
import { KnexCampaignRepository } from "../../../../infrastructure/database/repositories/knex-campaign-repository";
import { KnexRecipientRepository } from "../../../../infrastructure/database/repositories/knex-recipient-repository";

import { RabbitMQConnection } from "../connection/rabbitmq-connection";
import { RabbitMQPublisher } from "../publisher/rabbitmq-publisher";
import { EmailQueue } from "../queues/email.queue";

import { startEmailConsumer } from "./email.consumer";
import { EmailHandler } from "./email.handler";

async function startWorker() {
    const log = logger.child({ context: "EmailWorker" });

    const conn = await RabbitMQConnection.getInstance();
    const channel = conn.getChannel();

    const publisher = new RabbitMQPublisher();
    const recipientRepository = new KnexRecipientRepository();
    const campaignRepository = new KnexCampaignRepository();

    const sendEmailUseCase = new SendEmailUseCase(
        recipientRepository,
        campaignRepository
    );

    const handler = new EmailHandler(
        sendEmailUseCase,
        recipientRepository,
        campaignRepository,
        publisher
    );

    // Exchange principal
    await channel.assertExchange(EmailQueue.exchange, "direct", {
        durable: true,
    });

    // Fila principal de envio de emails
    const queue = await channel.assertQueue(EmailQueue.queue, {
        durable: true,
    });

    // Binding da fila principal ao exchange
    await channel.bindQueue(
        queue.queue,
        EmailQueue.exchange,
        EmailQueue.routingKey
    );

    // Fila de Delay (Sem consumidores, encaminha de volta para a exchange via TTL expiration)
    await channel.assertQueue(EmailQueue.delayQueue, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": EmailQueue.exchange,
            "x-dead-letter-routing-key": EmailQueue.routingKey,
        },
    });

    // Binding da fila de Delay
    await channel.bindQueue(
        EmailQueue.delayQueue,
        EmailQueue.exchange,
        EmailQueue.delayRoutingKey
    );

    // Fila de mensagens mortas
    await channel.assertQueue(EmailQueue.dlqQueue, {
        durable: true,
    });

    // Binding da fila de mensagens mortas ao exchange
    await channel.bindQueue(
        EmailQueue.dlqQueue,
        EmailQueue.exchange,
        EmailQueue.dlqRoutingKey
    );

    channel.prefetch(10);

    log.info("Worker started");

    await startEmailConsumer(channel, queue.queue, handler);
}

startWorker();