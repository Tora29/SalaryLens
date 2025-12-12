import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { seedNavigation } from "./navigation";
import { seedSalary } from "./salary";

const connectionString = process.env.DATABASE_URL;

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // eslint-disable-next-line no-console
  console.log("🌱 Starting seed...\n");

  try {
    await seedNavigation(prisma);
    await seedSalary(prisma);

    // eslint-disable-next-line no-console
    console.log("\n✅ Seed completed successfully!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
