import { PrismaClient } from "@prisma/client";

// Singleton do Prisma Client
// Evita múltiplas conexões em desenvolvimento com hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
