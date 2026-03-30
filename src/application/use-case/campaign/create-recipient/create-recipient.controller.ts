import { Request, Response } from "express";
import { ApiResponseFactory } from "../../../../shared/http/api-response-factory";
import { CreateRecipientUseCase } from "./create-recipient.use-case";


export class CreateRecipientController {
  constructor(
    private readonly createRecipientUseCase: CreateRecipientUseCase
  ) { }

  async handler(req: Request, res: Response) {
    const result = await this.createRecipientUseCase.execute(req.body);
    return res.status(201).json(
      ApiResponseFactory.success(
        result,
        "Recipients added successfully",
        201
      )
    );
  }
}

