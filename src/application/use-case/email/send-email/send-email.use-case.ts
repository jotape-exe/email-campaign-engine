import { CampaignRepository } from "@/application/ports/campaign.repository";
import { RecipientRepository } from "@/application/ports/recipient.repository";
import { InternalServerError } from "../../../../shared/errors/internal-server-error";

export class SendEmailUseCase {
  constructor(
    private readonly recipientRepository: RecipientRepository,
    private readonly campaignRepository: CampaignRepository
  ) { }

  async execute(input: {
    campaignId: string;
    recipientId: string;
    email: string;
    attempt: number;
  }) {

    await this.recipientRepository.incrementAttempt(input.recipientId);

    // 20% de chance de falhar
    const shouldFail = Math.random() < 0.2;
    if (shouldFail) {
      throw new InternalServerError("Email send failed");
    }

    await this.recipientRepository.markAsSent(input.recipientId);

    await this.campaignRepository.incrementSuccess(input.campaignId);
    await this.campaignRepository.incrementProcessed(input.campaignId);
  }
}