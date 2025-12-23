/**
 * Test database connection script
 * Run with: bun src/test-connection.ts
 */

import { getDatabase, initializeDatabase, closeDatabase } from "./infrastructure/persistence/database";

async function testConnection() {
  console.log("🔍 Testing database connection...\n");

  try {
    const db = getDatabase();

    // Test basic query using template tag
    console.log("📡 Executing test query...");

    const result = await db`SELECT version() as version`;

    // Handle result - postgres returns array
    let version: string = "";

    if (Array.isArray(result) && result.length > 0) {
      version = result[0].version || "";
    } else if (result && typeof result === "object") {
      version = (result as any).version || "";
    }

    if (version) {
      console.log("✅ Database connection successful!\n");
      console.log(`📊 PostgreSQL Version: ${version}\n`);

      // Test database initialization
      console.log("🔄 Testing database initialization...");
      await initializeDatabase();

      console.log("\n✅ All tests passed!");
    } else {
      console.log("❌ Connection failed: No version info received");
      console.log("Result received:", result);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Connection failed:", error);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
      if (error.stack) {
        console.error(
          `   Stack: ${error.stack.split("\n").slice(0, 5).join("\n")}`
        );
      }
    }
    console.error("\n💡 Please check:");
    console.error("   1. PostgreSQL is running");
    console.error("   2. Database 'forex_helper' exists");
    console.error("   3. Connection credentials in .env are correct");
    console.error("   4. DATABASE_URL format: postgresql://user@host:port/database");
    process.exit(1);
  } finally {
    // Close connection
    await closeDatabase();
  }
}

testConnection();
