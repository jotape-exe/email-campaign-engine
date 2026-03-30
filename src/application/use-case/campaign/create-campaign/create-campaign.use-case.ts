import { CampaignRepository } from "@/application/ports/campaign.repository";
import { Campaign } from "../../../../domain/entities/campaign";
import { SchemaValidation } from "../../../../shared/errors/schema-validation";
import { CreateCampaignDTO } from "./create-campaign.dto";
import { CreateCampaignSchema } from "./create-campaign.schema";

export class CreateCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository
  ) { }

  async execute(data: CreateCampaignDTO) {
    const validationResult = await CreateCampaignSchema.safeParseAsync(data);

    if (!validationResult.success) {
      throw new SchemaValidation(
        "Validation failed",
        validationResult.error.issues
      );
    }

    const campaign = Campaign.create({
      name: validationResult.data.name,
    });

    const result = await this.campaignRepository.create(campaign);
    return result;
  }
}