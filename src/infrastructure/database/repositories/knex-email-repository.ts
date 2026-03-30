import { EmailRepository } from "@/application/ports/email.repository";

export class KnexEmailRepository implements EmailRepository {
  async create(data: any): Promise<any> {
    throw new Error("Not implemented");
  }

  async findById(id: string): Promise<any | null> {
    throw new Error("Not implemented");
  }
}