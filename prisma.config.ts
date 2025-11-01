import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  engine: "classic",
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL || "file:./dev.db"
  },
  // migrations: { path: path.join("prisma", "migrations") }, // optional
});
