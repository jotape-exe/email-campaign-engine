import { Request, Response } from "express";
import { SendEmailUseCase } from "./send-email.use-case";

export class SendEmailController {
  constructor(
    private readonly sendEmailUseCase: SendEmailUseCase
  ) {}

  async handler(req: Request, res: Response) {
    const result = await this.sendEmailUseCase.execute(req.body);
    return res.status(200).json(result);
  }
}