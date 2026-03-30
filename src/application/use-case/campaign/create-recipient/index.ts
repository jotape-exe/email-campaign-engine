import { KnexCampaignRepository } from "@/infrastructure/database/repositories/knex-campaign-repository";
import { KnexRecipientRepository } from "@/infrastructure/database/repositories/knex-recipient-repository";
import { CreateRecipientController } from "./create-recipient.controller";
import { CreateRecipientUseCase } from "./create-recipient.use-case";

const campaignRepository = new KnexCampaignRepository();
const recipientRepository = new KnexRecipientRepository();

const useCase = new CreateRecipientUseCase(campaignRepository, recipientRepository);
const controller = new CreateRecipientController(useCase);

export { controller as createRecipientController };
