import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connect } from "./db";

async function main() {
  const { db, close } = connect();
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied.");
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
