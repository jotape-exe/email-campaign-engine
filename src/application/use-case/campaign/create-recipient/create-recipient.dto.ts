export interface CreateRecipientDTO {
    campaignId: string;
    recipients: {
        email: string;
    }[];
};