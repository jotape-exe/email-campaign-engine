import { ApiError } from "../http/api-error";
import { ErrorCode } from "./code";

export class SchemaValidation extends ApiError {
    constructor(message: string, details?: unknown) {
        super(message, 400, ErrorCode.BAD_REQUEST, details);
    }
}
