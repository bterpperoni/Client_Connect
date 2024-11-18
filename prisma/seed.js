// Usage: node seed.js
// This script will generate a random seed and save it to a file named "seed.txt" in
// the same directory as this script.
// It will also print the seed to the console.

// Import the necessary libraries

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const db = new PrismaClient();

// const user = await db.user.findUnique({ where: { email: "test@example.com" } });
// const hashedPassword = await saltAndHashPassword(user?.password ?? "");
// const userWithHashedPassword = await db.user.update({ where: { email: "test@example.com" }, data: { password: hashedPassword } });

// ...

// Salt and hash the password

// Seed the database with a user
const main = async () => {
  const password = await hash('Test123*', 10);
  await db.user.createMany({
    data: [
      {
        id: 'cku1g02xg0001z3vy8n5rj1hf',
        email: 'maxime.curon@risk-horizon.be',
        password,
      },
    ],
  });
};

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
