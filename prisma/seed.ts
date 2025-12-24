/**
 * Prisma Seed Script
 * 
 * Run with: bun prisma/seed.ts
 * Or: bun run db:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  console.log("🗑️  Cleaning existing data...");
  await prisma.trade.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ All data cleaned");

  // Create a test user
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: "test@example.com",
      passwordHash: hashedPassword,
    },
  });

  console.log("✅ Created/Updated user:", user.email);

  // Create user profile
  const profile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      firstName: "Test",
      lastName: "User",
      displayName: "Test User",
    },
  });

  console.log("✅ Created/Updated user profile:", profile.displayName);

  // Create sample trades
  const trades = await prisma.trade.createMany({
    data: [
      {
        id: crypto.randomUUID(),
        userId: user.id,
        pair: "EUR/USD",
        direction: "BUY",
        entryPrice: 1.0850,
        lotSize: 0.1,
        stopLoss: 1.0800,
        takeProfit: 1.0950,
        riskAmount: 50.0,
        status: "OPEN",
        entryTime: new Date(),
      },
      {
        id: crypto.randomUUID(),
        userId: user.id,
        pair: "GBP/USD",
        direction: "SELL",
        entryPrice: 1.2650,
        exitPrice: 1.2600,
        lotSize: 0.1,
        stopLoss: 1.2700,
        takeProfit: 1.2550,
        pips: 50,
        points: 50,
        profitLoss: 50.0,
        riskAmount: 50.0,
        riskRewardRatio: 1.0,
        status: "WIN",
        entryTime: new Date(Date.now() - 86400000), // Yesterday
        exitTime: new Date(),
      },
    ],
  });

  console.log("✅ Created", trades.count, "trade records");

  // Summary
  const summary = await prisma.$transaction([
    prisma.user.count(),
    prisma.userProfile.count(),
    prisma.trade.count(),
  ]);

  console.log("\n📊 Data Summary:");
  console.log("   - Users:", summary[0]);
  console.log("   - User Profiles:", summary[1]);
  console.log("   - Trades:", summary[2]);
  console.log("\n🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

