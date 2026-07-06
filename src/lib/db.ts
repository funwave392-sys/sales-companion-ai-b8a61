import { PrismaClient } from "@prisma/client";
import { getConnectionString } from "@netlify/database";
if (process.env.NETLIFY === "true") process.env.DATABASE_URL = getConnectionString();
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
