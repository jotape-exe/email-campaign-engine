import { Campaign } from "../../domain/entities/campaign";

export interface CampaignRepository {
    create(data: Campaign): Promise<Campaign>;
    findById(id: string): Promise<Campaign | null>;
    update(campaign: Campaign): Promise<void>;

    incrementSuccess(campaignId: string): Promise<void>;
    incrementFailure(campaignId: string): Promise<void>;
    incrementProcessed(campaignId: string): Promise<void>;
}