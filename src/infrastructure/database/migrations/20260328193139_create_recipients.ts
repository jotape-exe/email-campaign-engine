import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("recipients", (table) => {
        table
            .uuid("id")
            .primary()
            .defaultTo(knex.raw("gen_random_uuid()"));

        table
            .uuid("campaign_id")
            .notNullable()
            .references("id")
            .inTable("campaigns");

        table.string("email").notNullable();

        table
            .enu("status", ["PENDING", "SENT", "FAILED"], {
                useNative: true,
                enumName: "recipient_status",
            })
            .defaultTo("PENDING")
            .notNullable();

        table.integer("attempts").defaultTo(0).notNullable();

        table.boolean("is_active").defaultTo(true).notNullable();

        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());

        table.index(["campaign_id"]);
        table.index(["status"]);

        table.unique(["campaign_id", "email"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("recipients");
    await knex.raw(`DROP TYPE IF EXISTS recipient_status`);
}