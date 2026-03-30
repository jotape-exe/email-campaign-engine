import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("campaigns", (table) => {

        table.boolean("is_active").defaultTo(true).notNullable();
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now()).alter();
        table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("campaigns", (table) => {
        table.dropColumn("is_active");
        table.dropColumn("updated_at");

        table.timestamp("created_at").defaultTo(knex.fn.now()).alter();
    });
}