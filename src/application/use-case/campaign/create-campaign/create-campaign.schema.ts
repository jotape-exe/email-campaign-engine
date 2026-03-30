import { z } from "zod";

export const CreateCampaignSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
});