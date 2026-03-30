import { KnexCampaignRepository } from "@/infrastructure/database/repositories/knex-campaign-repository";
import { KnexRecipientRepository } from "@/infrastructure/database/repositories/knex-recipient-repository";
import { RabbitMQPublisher } from "@/infrastructure/messaging/rabbitmq/publisher/rabbitmq-publisher";
import { StartCampaignController } from "./start-campaign.controller";
import { StartCampaignUseCase } from "./start-campaign.use-case";

const repository = new KnexCampaignRepository();
const recipientRepository = new KnexRecipientRepository();
const messagePublisher = new RabbitMQPublisher();
const useCase = new StartCampaignUseCase(repository, recipientRepository, messagePublisher);
const controller = new StartCampaignController(useCase);

export { controller as startCampaignController };
