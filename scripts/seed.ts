// Seed script — populates the 15 fixed flight routes into the database.
// Run once after initial setup: npm run db:seed

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const routes = [
  { origin: "TRV", destination: "BKK", originCity: "Trivandrum", destCity: "Bangkok (Suvarnabhumi)" },
  { origin: "TRV", destination: "DMK", originCity: "Trivandrum", destCity: "Bangkok (Don Mueang)" },
  { origin: "TRV", destination: "HKT", originCity: "Trivandrum", destCity: "Phuket" },
  { origin: "TRV", destination: "KBV", originCity: "Trivandrum", destCity: "Krabi" },
  { origin: "TRV", destination: "CNX", originCity: "Trivandrum", destCity: "Chiang Mai" },

  { origin: "COK", destination: "BKK", originCity: "Kochi", destCity: "Bangkok (Suvarnabhumi)" },
  { origin: "COK", destination: "DMK", originCity: "Kochi", destCity: "Bangkok (Don Mueang)" },
  { origin: "COK", destination: "HKT", originCity: "Kochi", destCity: "Phuket" },
  { origin: "COK", destination: "KBV", originCity: "Kochi", destCity: "Krabi" },
  { origin: "COK", destination: "CNX", originCity: "Kochi", destCity: "Chiang Mai" },

  { origin: "BLR", destination: "BKK", originCity: "Bangalore", destCity: "Bangkok (Suvarnabhumi)" },
  { origin: "BLR", destination: "DMK", originCity: "Bangalore", destCity: "Bangkok (Don Mueang)" },
  { origin: "BLR", destination: "HKT", originCity: "Bangalore", destCity: "Phuket" },
  { origin: "BLR", destination: "KBV", originCity: "Bangalore", destCity: "Krabi" },
  { origin: "BLR", destination: "CNX", originCity: "Bangalore", destCity: "Chiang Mai" },
];

async function main() {
  console.log("Seeding routes...");

  for (const route of routes) {
    await db.route.upsert({
      where: { origin_destination: { origin: route.origin, destination: route.destination } },
      update: {},
      create: route,
    });
  }

  console.log(`Seeded ${routes.length} routes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
