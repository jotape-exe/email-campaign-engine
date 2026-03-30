export abstract class ApiError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number,
        public readonly internalCode: string,
        public readonly details?: unknown,
    ) {
        super(message);
    }
}

export interface ApiErrorPayload {
    code: string;
    details?: unknown;
}