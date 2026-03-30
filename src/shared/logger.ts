import pino from "pino";

export const logger = pino({
    level: "debug",
    transport: {
        // dev only
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});