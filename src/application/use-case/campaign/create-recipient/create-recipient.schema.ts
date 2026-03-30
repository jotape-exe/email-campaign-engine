import { z } from "zod";

export const CreateRecipientSchema = z.object({
    campaignId: z.uuid(),
    recipients: z
        .array(
            z.object({
                email: z.email(),
            })
        )
        .min(1),
});