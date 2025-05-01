const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// This is a simple example of how to use Prisma Client to create a user and fetch all users
// and their related posts and profiles.
async function main() {
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      posts: {
        create: { title: "Hello World" },
      },
      profile: {
        create: { bio: "I like turtles" },
      },
    },
  });

  // Fetch all users and include their posts and profiles
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.dir(allUsers, { depth: null });
}

// Fetch a single user by ID and include their posts and profile
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
