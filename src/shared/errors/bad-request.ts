import { ApiError } from "@/shared/http/api-error";
import { ErrorCode } from "./code";

export class BadRequestError extends ApiError {
    constructor(message: string, details?: unknown) {
        super(message, 400, ErrorCode.BAD_REQUEST, details);
    }
}