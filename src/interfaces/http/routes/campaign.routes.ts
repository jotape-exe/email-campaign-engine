import { createCampaignController } from "@/application/use-case/campaign/create-campaign";
import { Router } from "express";
import { createRecipientController } from "../../../application/use-case/campaign/create-recipient";
import { startCampaignController } from "../../../application/use-case/campaign/start-campaign";

const router = Router();

router.post("/campaigns", (req, res) =>
    createCampaignController.handler(req, res)
);

router.post("/campaigns/:id/recipients", (req, res) =>
    createRecipientController.handler(req, res)
);

router.post("/campaigns/:id/start", (req, res) =>
    startCampaignController.handler(req, res)
);

export { router as campaignRoutes };
