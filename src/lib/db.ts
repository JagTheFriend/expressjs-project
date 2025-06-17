import { PrismaClient } from "./generated/prisma-client";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

const globalVariable = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalVariable.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalVariable.prisma = db;
