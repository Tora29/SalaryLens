import "dotenv/config";
import { PrismaClient } from "../../../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// グローバル変数の型定義
declare global {
  var __db: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

// 開発環境ではホットリロードでインスタンスが重複しないように
const prisma = globalThis.__db ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = prisma;
}

export { prisma };
