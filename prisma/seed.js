require('dotenv').config();
const { saltAndHashPassword } = require('../src/lib/utils/password');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

// const user = await db.user.findUnique({ where: { email: "test@example.com" } });
// const hashedPassword = await saltAndHashPassword(user?.password ?? "");
// const userWithHashedPassword = await db.user.update({ where: { email: "test@example.com" }, data: { password: hashedPassword } });
db.$connect();

// ...

// Seed the database with a user
const main = async () =>
  db.user.create({
    data: {
      name: 'MCuron',
      email: 'maxime.curon@risk-horizon.be',
      password: await saltAndHashPassword('Test123*'),
    },
  });

// ...

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

// ...
