import { Request, Response } from "express";
import { ApiResponseFactory } from "../../../../shared/http/api-response-factory";
import { CampaignMapper } from "../../../mappers/campaign.mapper";
import { CreateCampaignUseCase } from "./create-campaign.use-case";

export class CreateCampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase
  ) { }

  async handler(req: Request, res: Response) {
    const result = await this.createCampaignUseCase.execute(req.body);
    return res.status(200).json(ApiResponseFactory.success(
      CampaignMapper.toResponse(result),
      "Campaign created successfully",
      200
    ));
  }
}