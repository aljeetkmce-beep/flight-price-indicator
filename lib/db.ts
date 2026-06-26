import { PrismaClient } from "@prisma/client";

// Prisma client singleton.
// In development, Next.js hot-reloads the server on every file change.
// Without this pattern, each reload creates a new DB connection,
// eventually exhausting the connection pool.
// The global check ensures we reuse the same client across reloads.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
