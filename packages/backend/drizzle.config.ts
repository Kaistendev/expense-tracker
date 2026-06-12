import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infrastructure/database/sqlite/schema.ts",
  out: "./src/infrastructure/database/sqlite/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/expenses.db",
  },
});
