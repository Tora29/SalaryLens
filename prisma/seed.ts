import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const currentYear = new Date().getFullYear();

  // 既存データを削除
  await prisma.salaryRecord.deleteMany();

  // 12ヶ月分のモックデータを生成
  const records = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const baseSalary = 350000 + Math.floor(Math.random() * 30000);
    const overtime = Math.floor(Math.random() * 50000);
    const bonus =
      [6, 12].includes(month) ? 500000 + Math.floor(Math.random() * 200000) : 0;
    const deductions = Math.floor((baseSalary + overtime + bonus) * 0.2);
    const netSalary = baseSalary + overtime + bonus - deductions;

    // 残業時間のモックデータ生成
    const totalOvertimeHours = Math.floor(Math.random() * 80);
    const fixedOvertimeHours = Math.min(totalOvertimeHours, 45);
    const remainingHours = Math.max(totalOvertimeHours - 45, 0);
    const extraOvertimeHours = Math.min(remainingHours, 15);
    const over60OvertimeHours = Math.max(remainingHours - 15, 0);

    return {
      year: currentYear,
      month,
      baseSalary,
      overtime,
      bonus,
      deductions,
      netSalary,
      fixedOvertimeHours,
      extraOvertimeHours,
      over60OvertimeHours,
    };
  });

  for (const record of records) {
    await prisma.salaryRecord.create({ data: record });
  }

  // eslint-disable-next-line no-console
  console.log(`✅ ${records.length}件の給与データを作成しました`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
