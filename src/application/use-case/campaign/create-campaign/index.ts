import { CreateCampaignUseCase } from "./create-campaign.use-case";
import { CreateCampaignController } from "./create-campaign.controller";
import { KnexCampaignRepository } from "@/infrastructure/database/repositories/knex-campaign-repository";

const repository = new KnexCampaignRepository();
const useCase = new CreateCampaignUseCase(repository);
const controller = new CreateCampaignController(useCase);

export { controller as createCampaignController };