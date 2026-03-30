export interface RecipientRepository {
    createMany(data: {
        campaignId: string;
        emails: string[];
    }): Promise<void>;

    findByCampaignId(campaignId: string): Promise<any[]>;

    markAsSent(recipientId: string): Promise<void>;
    incrementAttempt(recipientId: string): Promise<void>;
    markAsFailed(recipientId: string): Promise<void>;
}