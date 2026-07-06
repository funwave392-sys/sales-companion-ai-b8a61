import { PrismaClient } from "@prisma/client";

if (process.env.NETLIFY === "true" && process.env.NETLIFY_DB_URL) {
  process.env.DATABASE_URL = process.env.NETLIFY_DB_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
