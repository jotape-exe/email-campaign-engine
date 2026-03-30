import { CampaignStatus } from "../enums/campagn-status";

export class Campaign {
    constructor(
        public id: string,
        public name: string,
        public status: CampaignStatus,
        public totalRecipients: number,
        public processedCount: number,
        public successCount: number,
        public failureCount: number,
        public createdAt: Date,
    ) { }

    start() {
        if (this.status !== CampaignStatus.DRAFT) {
            throw new Error("Campaign must be draft to start");
        }
        this.status = CampaignStatus.PROCESSING;
    }

    static create(props: { name: string }) {
        return new Campaign(
            crypto.randomUUID(),
            props.name,
            CampaignStatus.DRAFT,
            0,
            0,
            0,
            0,
            new Date()
        );
    }
}