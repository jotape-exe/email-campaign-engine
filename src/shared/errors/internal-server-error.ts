import { ApiError } from "../http/api-error";
import { ErrorCode } from "./code";

export class InternalServerError extends ApiError {
    constructor(message: string) {
        super(message, 500, ErrorCode.INTERNAL_SERVER_ERROR);
    }
}