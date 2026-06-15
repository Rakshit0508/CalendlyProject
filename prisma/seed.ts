import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DATABASE_URL } from "../src/config/env";

const adapter= new PrismaPg({
    connectionString: DATABASE_URL
})

export const prisma= new PrismaClient({
    adapter
})


async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: "john.doe@example.com",
        name: "John Doe",
      },
      {
        email: "jane.smith@example.com",
        name: "Jane Smith",
      },
      {
        email: "alice.brown@example.com",
        name: "Alice Brown",
      },
      {
        email: "bob.wilson@example.com",
        name: "Bob Wilson",
      },
      {
        email: "charlie.davis@example.com",
        name: "Charlie Davis",
      },
      {
        email:"singhalrakshit0824@gmail.com",
        name: "Rakshit Singhal"
      }
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });