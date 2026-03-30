import { db } from "./src/infrastructure/database/knex/connection";
async function run() {
  const campaigns = await db("campaigns").select("*");
  console.log("Campaigns:", campaigns);
  process.exit(0);
}
run();
