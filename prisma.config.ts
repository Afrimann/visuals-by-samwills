import { defineConfig } from "prisma/config";

// Prisma CLI (db push, migrate) only supports local SQLite files, not libsql:// URLs.
// Schema changes: edit schema.prisma, run `prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`
// then apply the output SQL to Turso via their dashboard or HTTP API.
export default defineConfig({
  datasource: {
    url: "file:./prisma/dev.db",
  },
});
