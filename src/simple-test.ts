/**
 * Simple database connection test
 * This script tests the most basic connection without complex error handling
 */

async function simpleTest() {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://ikhsanpahdian@localhost:5432/forex_helper";
  
  console.log("Testing connection to:", databaseUrl.replace(/:[^:@]+@/, ":****@"));
  
  try {
    const sql = Bun.sql(databaseUrl);
    console.log("✅ Bun.sql() created successfully");
    console.log("Type of sql:", typeof sql);
    console.log("Has query method:", typeof sql.query);
    console.log("Has unsafe method:", typeof sql.unsafe);
    console.log("Is callable:", typeof sql === "function");
    
    // Try to get sql properties
    console.log("\n🔍 Inspecting sql object...");
    console.log("Keys:", Object.keys(sql));
    console.log("Prototype:", Object.getPrototypeOf(sql));
    console.log("Prototype keys:", Object.keys(Object.getPrototypeOf(sql)));
    
    // Check for value property
    console.log("Has 'value' property:", "value" in sql);
    console.log("Has 'columns' property:", "columns" in sql);
    
    // Try accessing properties directly
    if ("value" in sql) {
      console.log("Value:", sql.value);
    }
    if ("columns" in sql) {
      console.log("Columns:", sql.columns);
    }
    
    // Try to use it as template tag if it has Symbol properties
    const symbols = Object.getOwnPropertySymbols(sql);
    console.log("Symbols:", symbols);
    
    // Try different ways to execute
    console.log("\n📡 Attempting queries...");
    
    // Method 1: Direct template tag usage (most common for Bun.sql)
    try {
      console.log("Trying: const result = await sql`SELECT version() as version`");
      // Cast sql to any to test if it's callable as template tag
      const sqlAny = sql as any;
      if (typeof sqlAny === "function") {
        const result = await sqlAny`SELECT version() as version`;
        console.log("✅ Template tag works!", result);
        console.log("Result type:", typeof result);
        console.log("Is array:", Array.isArray(result));
        if (Array.isArray(result) && result.length > 0) {
          console.log("First item:", result[0]);
          console.log("Version:", result[0]?.version);
        }
      } else {
        // Try calling it directly even though it's not a function
        console.log("Trying to call as template tag even though it's not function type...");
        const result = await (sql as any)`SELECT version() as version`;
        console.log("✅ Template tag works!", result);
      }
    } catch (e) {
      console.error("❌ Template tag failed:", e);
      if (e instanceof Error) {
        console.error("Error message:", e.message);
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}

simpleTest();
