import { CampaignRepository } from "@/application/ports/campaign.repository";
import { RecipientRepository } from "@/application/ports/recipient.repository";

import { ConflictError } from "../../../../shared/errors/conflict-erro";
import { NotFoundError } from "../../../../shared/errors/not-found";
import { SchemaValidation } from "../../../../shared/errors/schema-validation";
import { CreateRecipientDTO } from "./create-recipient.dto";
import { CreateRecipientSchema } from "./create-recipient.schema";


export class CreateRecipientUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly recipientRepository: RecipientRepository
  ) { }

  async execute(input: CreateRecipientDTO) {
    const result = CreateRecipientSchema.safeParse(input);

    if (!result.success) {
      throw new SchemaValidation(
        "Validation failed",
        result.error.issues
      );
    }

    const { campaignId, recipients } = result.data;

    const campaign = await this.campaignRepository.findById(campaignId);

    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    if (campaign.status !== "DRAFT") {
      throw new ConflictError("Campaign must be in DRAFT status");
    }

    const uniqueEmails = Array.from(
      new Set(recipients.map((r) => r.email))
    );

    await this.recipientRepository.createMany({
      campaignId,
      emails: uniqueEmails,
    });

    return {
      total: uniqueEmails.length,
    };
  }
}