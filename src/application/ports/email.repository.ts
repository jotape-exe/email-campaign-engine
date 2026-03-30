export interface EmailRepository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any | null>;
}