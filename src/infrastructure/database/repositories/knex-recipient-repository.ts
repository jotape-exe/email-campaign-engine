import { RecipientRepository } from "@/application/ports/recipient.repository";
import { db } from "../knex/connection";

export class KnexRecipientRepository implements RecipientRepository {
    async findByCampaignId(campaignId: string): Promise<any[]> {
        return db("recipients").where({ campaign_id: campaignId });
    }

    async createMany({ campaignId, emails }: any) {
        const rows = emails.map((email: string) => ({
            campaign_id: campaignId,
            email,
        }));

        await db("recipients")
            .insert(rows)
            .onConflict(["campaign_id", "email"])
            .ignore();
    }

    async markAsSent(recipientId: string): Promise<void> {
        await db("recipients")
            .where({ id: recipientId })
            .update({
                status: "SENT",
            });
    }

    async incrementAttempt(recipientId: string): Promise<void> {
        await db("recipients")
            .where({ id: recipientId })
            .increment("attempts", 1);
    }

    async markAsFailed(recipientId: string): Promise<void> {
        await db("recipients")
            .where({ id: recipientId })
            .update({
                status: "FAILED",
            });
    }
}