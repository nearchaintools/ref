import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('Seeding...');

  await prisma.chain.create({
    data: {
      name: 'ref_finance_mainnet',
    },
  });

  console.log('Seeding finished');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
