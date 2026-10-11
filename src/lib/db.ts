import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Normalize connection string to prevent pg-connection-string security deprecation warning
// pg v8.13+ warns on 'require', 'prefer', and 'verify-ca', suggesting 'verify-full'
const connectionString = env.DATABASE_URL.replace(
  /([?&])sslmode=(?:require|prefer|verify-ca)(?=&|$)/g,
  "$1sslmode=verify-full"
);

// postgres adapter with connection string
const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// reuse prisma instance during development hot reload
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
