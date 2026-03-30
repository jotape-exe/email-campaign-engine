import { CampaignRepository } from "../../../../application/ports/campaign.repository";

import { MessagePublisher } from "../../../../application/ports/message-publisher.repository";
import { RecipientRepository } from "../../../../application/ports/recipient.repository";
import { CampaignStatus } from "../../../../domain/enums/campagn-status";
import { SchemaValidation } from "../../../../shared/errors/schema-validation";
import { NotFoundError } from "../../../../shared/errors/not-found";
import { BadRequestError } from "../../../../shared/errors/bad-request";
import { StartCampaignSchema } from "./start-campaign.schema";

export class StartCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly recipientRepository: RecipientRepository,
    private readonly messagePublisher: MessagePublisher
  ) { }

  async execute(input: { campaignId: string }) {
    const result = StartCampaignSchema.safeParse(input);

    if (!result.success) {
      throw new SchemaValidation(
        "Validation failed",
        result.error.issues
      );
    }

    const { campaignId } = result.data;

    const campaign = await this.campaignRepository.findById(campaignId);

    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    if (campaign.status !== "DRAFT") {
      throw new BadRequestError("Campaign already started");
    }

    const recipients =
      await this.recipientRepository.findByCampaignId(campaignId);

    if (!recipients.length) {
      throw new BadRequestError("No recipients found");
    }

    for (const recipient of recipients) {
      await this.messagePublisher.publish("email.send", {
        campaignId: campaign.id,
        recipientId: recipient.id,
        email: recipient.email,
        attempt: 1,
      });
    }

    campaign.status = CampaignStatus.PROCESSING;

    await this.campaignRepository.update(campaign);

    return {
      message: "Campaign started",
    };
  }
}