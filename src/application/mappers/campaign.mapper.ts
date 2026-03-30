import { Campaign } from "../../domain/entities/campaign";
import { CampaignStatus } from "../../domain/enums/campagn-status";

export class CampaignMapper {
    static toDomain(data: any): Campaign {
        return new Campaign(
            data.id,
            data.name,
            data.status as CampaignStatus,
            data.total_recipients,
            data.processed_count,
            data.success_count,
            data.failure_count,
            data.created_at
        );
    }

    static toResponse(campaign: Campaign) {
        return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            totalRecipients: campaign.totalRecipients,
            processedCount: campaign.processedCount,
            successCount: campaign.successCount,
            failureCount: campaign.failureCount,
            createdAt: campaign.createdAt,
        };
    }

    static toPersistence(campaign: Campaign) {
        return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            total_recipients: campaign.totalRecipients,
            processed_count: campaign.processedCount,
            success_count: campaign.successCount,
            failure_count: campaign.failureCount,
        };
    }
}