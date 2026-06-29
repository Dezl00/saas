const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.platformSetting.findUnique({ where: { id: "1" } });
  console.log("Settings in DB:", settings);
}

main().catch(console.error).finally(() => prisma.$disconnect());
