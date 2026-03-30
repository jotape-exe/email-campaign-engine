import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await knex.schema.createTable("campaigns", (table) => {
        table
            .uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table.string("name").notNullable();

        table
            .enu("status", ["DRAFT", "PROCESSING", "COMPLETED", "FAILED"], {
                useNative: true,
                enumName: "campaign_status",
            })
            .defaultTo("DRAFT")
            .notNullable();

        table.integer("total_recipients").defaultTo(0);
        table.integer("processed_count").defaultTo(0);
        table.integer("success_count").defaultTo(0);
        table.integer("failure_count").defaultTo(0);

        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("campaigns");
    await knex.raw(`DROP TYPE IF EXISTS campaign_status`);
}