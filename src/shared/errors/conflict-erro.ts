import { ApiError } from "../http/api-error";
import { ErrorCode } from "./code";

export class ConflictError extends ApiError {
    constructor(message: string) {
        super(message, 409, ErrorCode.CONFLICT);
    }
}