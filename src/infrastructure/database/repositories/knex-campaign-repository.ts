import { CampaignRepository } from "@/application/ports/campaign.repository";
import { CampaignMapper } from "../../../application/mappers/campaign.mapper";
import { Campaign } from "../../../domain/entities/campaign";
import { db } from "../knex/connection";

export class KnexCampaignRepository implements CampaignRepository {
  async create(campaign: Campaign): Promise<Campaign> {
    const [data] = await db("campaigns")
      .insert({
        name: campaign.name,
        status: campaign.status,
        total_recipients: campaign.totalRecipients,
        processed_count: campaign.processedCount,
        success_count: campaign.successCount,
        failure_count: campaign.failureCount,
      })
      .returning("*");

    return CampaignMapper.toDomain(data);
  }

  async findById(id: string): Promise<Campaign | null> {
    const data = await db("campaigns").where({ id }).first();
    if (!data) return null;
    return CampaignMapper.toDomain(data);
  }

  async update(campaign: Campaign): Promise<void> {
    await db("campaigns")
      .where({ id: campaign.id })
      .update(CampaignMapper.toPersistence(campaign));
  }

  async incrementSuccess(campaignId: string): Promise<void> {
    await db("campaigns")
      .where({ id: campaignId })
      .increment("success_count", 1);
  }

  async incrementFailure(campaignId: string): Promise<void> {
    await db("campaigns")
      .where({ id: campaignId })
      .increment("failure_count", 1);
  }

  async incrementProcessed(campaignId: string): Promise<void> {
    await db("campaigns")
      .where({ id: campaignId })
      .increment("processed_count", 1);
  }
}