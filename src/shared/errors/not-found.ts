import { ApiError } from "../http/api-error";
import { ErrorCode } from "./code";

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(message, 404, ErrorCode.NOT_FOUND);
    }
}