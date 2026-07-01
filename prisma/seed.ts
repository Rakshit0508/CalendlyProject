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
        slug: "john-doe"
      },
      {
        email: "jane.smith@example.com",
        name: "Jane Smith",
        slug: "jane-smith"
      },
      {
        email: "alice.brown@example.com",
        name: "Alice Brown",
        slug: "alice-brown"
      },
      {
        email: "bob.wilson@example.com",
        name: "Bob Wilson",
        slug: "bob-wilson"
      },
      {
        email: "charlie.davis@example.com",
        name: "Charlie Davis",
        slug: "charlie-davis"
      },
      {
        email:"singhalrakshit0824@gmail.com",
        name: "Rakshit Singhal",
        slug: "rakshit-singhal"
      }
    ],
    skipDuplicates: true,
  });
  // await prisma.eventType.createMany({
  //   data:[
  //     {
        
  //     }
  //   ]
  // })
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