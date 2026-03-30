import { ApiResponseFactory } from "@/shared/http/api-response-factory";
import { Request, Response } from "express";
import { StartCampaignUseCase } from "./start-campaign.use-case";

export class StartCampaignController {
  constructor(
    private readonly useCase: StartCampaignUseCase
  ) { }

  async handler(req: Request, res: Response) {
    const result = await this.useCase.execute({
      campaignId: req.params.id as string,
    });

    return res.json(
      ApiResponseFactory.success(result, "Campaign started")
    );
  }
}