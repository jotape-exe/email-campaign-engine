import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE recipient_status AS ENUM ('PENDING', 'SENT', 'FAILED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

    const hasStatus = await knex.schema.hasColumn("recipients", "status");
    const hasAttempts = await knex.schema.hasColumn("recipients", "attempts");

    await knex.schema.alterTable("recipients", (table) => {
        if (!hasStatus) {
            table
                .enu("status", ["PENDING", "SENT", "FAILED"], {
                    useNative: true,
                    enumName: "recipient_status",
                    existingType: true,
                })
                .defaultTo("PENDING");
        }

        if (!hasAttempts) {
            table.integer("attempts").defaultTo(0);
        }
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("recipients", (table) => {
        table.dropColumn("status");
        table.dropColumn("attempts");
    });

    await knex.raw(`
  DO $$ BEGIN
    DROP TYPE recipient_status;
  EXCEPTION
    WHEN dependent_objects_still_exist THEN null;
  END $$;
`);
}