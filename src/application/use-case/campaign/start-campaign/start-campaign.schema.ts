import { z } from "zod";

export const StartCampaignSchema = z.object({
    campaignId: z.uuid(),
});