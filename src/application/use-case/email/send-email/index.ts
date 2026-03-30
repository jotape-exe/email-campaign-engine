import { KnexCampaignRepository } from "@/infrastructure/database/repositories/knex-campaign-repository";
import { KnexRecipientRepository } from "@/infrastructure/database/repositories/knex-recipient-repository";
import { SendEmailController } from "./send-email.controller";
import { SendEmailUseCase } from "./send-email.use-case";

const recipientRepository = new KnexRecipientRepository();
const campaignRepository = new KnexCampaignRepository();
const useCase = new SendEmailUseCase(recipientRepository, campaignRepository);
const controller = new SendEmailController(useCase);

export { controller as sendEmailController };
