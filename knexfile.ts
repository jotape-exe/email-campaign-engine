import 'dotenv/config';
import type { Knex } from "knex";
import path from "path";
import { env } from "./src/shared/env";

const config: Record<string, Knex.Config> = {
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL || {
            host: env.DB_HOST,
            port: Number(env.DB_PORT),
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
        },
        migrations: {
            directory: path.resolve(
                __dirname,
                "src/infrastructure/database/migrations"
            ),
            extension: "ts",
        },
    },
};

export default config;