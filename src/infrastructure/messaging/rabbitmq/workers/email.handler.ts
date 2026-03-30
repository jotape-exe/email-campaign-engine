import { randomUUID } from "crypto";
import { CampaignRepository } from "../../../../application/ports/campaign.repository";
import { RecipientRepository } from "../../../../application/ports/recipient.repository";
import { SendEmailUseCase } from "../../../../application/use-case/email/send-email/send-email.use-case";
import { logger } from "../../../../shared/logger";
import { RabbitMQPublisher } from "../publisher/rabbitmq-publisher";
import { EmailQueue } from "../queues/email.queue";


export class EmailHandler {
    constructor(
        private readonly sendEmailUseCase: SendEmailUseCase,
        private readonly recipientRepository: RecipientRepository,
        private readonly campaignRepository: CampaignRepository,
        private readonly publisher: RabbitMQPublisher
    ) { }

    async handle(content: any) {
        const correlationId = content.correlationId ?? randomUUID();

        const log = logger.child({
            context: "EmailWorker",
            correlationId,
            email: content.email,
            campaignId: content.campaignId,
            recipientId: content.recipientId,
        });

        const attempt = content.attempt ?? 1;

        try {
            log.info({ attempt }, "Processing email");

            await this.sendEmailUseCase.execute(content);

            log.info({ attempt }, "Email sent successfully");

            return { success: true };
        } catch (err) {
            log.error({ attempt, err }, "Failed to send email");

            await this.recipientRepository.incrementAttempt(content.recipientId);

            if (attempt < 3) {
                log.warn({ nextAttempt: attempt + 1 }, "Retrying message");

                await this.publisher.publish(EmailQueue.routingKey, {
                    ...content,
                    attempt: attempt + 1,
                    correlationId,
                });

                return { success: false, retry: true };
            }

            log.warn("Max attempts reached, sending to DLQ");

            await this.publisher.publish(EmailQueue.dlqRoutingKey, {
                ...content,
                correlationId,
            });

            await this.recipientRepository.markAsFailed(content.recipientId);
            await this.campaignRepository.incrementFailure(content.campaignId);
            await this.campaignRepository.incrementProcessed(content.campaignId);

            return { success: false, retry: false };
        }
    }
}