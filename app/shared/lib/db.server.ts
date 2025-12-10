import { PrismaClient } from "@prisma/client";

// グローバル変数の型定義
declare global {
  var __db: PrismaClient | undefined;
}

// 開発環境ではホットリロードでインスタンスが重複しないように
const prisma = globalThis.__db ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = prisma;
}

export { prisma };
