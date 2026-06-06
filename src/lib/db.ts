import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Create a Postgres adapter using the DATABASE_URL from .env file
// This adapter handles the actual connection to your Postgres database
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

// Access Node.js global object with a custom type
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Reuse existing prisma instance if it exists on global (hot reload)
// Otherwise create a new PrismaClient instance with the postgres adapter
const db = globalForPrisma.prisma || new PrismaClient({ adapter });

// In development only — save the db instance to global object
// So next hot reload reuses the same instance instead of creating a new one
// In production this is skipped since there are no hot reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
