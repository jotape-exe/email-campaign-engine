import { ApiError } from "@/shared/http/api-error";
import { ApiResponseFactory } from "@/shared/http/api-response-factory";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof ApiError) {
        const response = ApiResponseFactory.error(err);
        return res.status(err.statusCode).json(response);
    }

    console.error(err);

    return res.status(500).json(
        ApiResponseFactory.error({
            message: "Internal server error",
            statusCode: 500,
            internalCode: "INTERNAL_ERROR",
        } as ApiError),
    );
}