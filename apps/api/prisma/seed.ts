import { PrismaClient } from './generated/prisma';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();
async function main() {
  const userId = createId();
  await prisma.user.upsert({
    where: { email: 'example@example.com' },
    update: {},
    create: {
      id: userId,
      email: 'example@example.com',
      name: 'TestUser',
      screen_name: userId,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
