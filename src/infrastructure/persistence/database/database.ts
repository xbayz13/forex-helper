/**
 * Database setup using postgres package for PostgreSQL
 * Using postgres package as Bun.sql() seems to have API issues
 */

import postgres from "postgres";
import { env } from "@/config/env";

let dbInstance: postgres.Sql | null = null;

/**
 * Get or create database connection
 */
export function getDatabase(): postgres.Sql {
  if (!dbInstance) {
    // Use validated DATABASE_URL from env config
    const databaseUrl = env.DATABASE_URL;

    try {
      dbInstance = postgres(databaseUrl, {
        max: 10, // Maximum number of connections
        idle_timeout: 20,
        connect_timeout: 10,
      });

      // Parse database URL for logging (without password)
      const url = new URL(databaseUrl);
      console.log("🔗 Connecting to database:", `${url.protocol}//${url.username}@${url.hostname}:${url.port}${url.pathname}`);
      console.log(`📦 PostgreSQL database connection initialized`);
      console.log(`   Host: ${url.hostname}`);
      console.log(`   Port: ${url.port || "5432"}`);
      console.log(`   Database: ${url.pathname.replace("/", "")}`);
    } catch (error) {
      console.error("❌ Failed to create database connection:", error);
      throw new Error(
        `Database connection failed: ${error instanceof Error ? error.message : String(error)}\n` +
        `Please check your DATABASE_URL in .env file.\n` +
        `Format: postgresql://user:password@host:port/database`
      );
    }
  }

  return dbInstance;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.end();
    dbInstance = null;
    console.log("🔒 Database connection closed");
  }
}

/**
 * Execute a raw SQL query
 */
export async function executeQuery(sql: string): Promise<any> {
  const db = getDatabase();
  return await db.unsafe(sql);
}

/**
 * Execute a query with template tag support
 */
export async function query(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<any> {
  const db = getDatabase();
  return await db(strings, ...values);
}

/**
 * Load migration file
 */
async function loadMigration(filename: string): Promise<string> {
  // Try multiple paths for migration file
  const possiblePaths = [
    new URL(`../migrations/${filename}`, import.meta.url).pathname,
    new URL(`./migrations/${filename}`, import.meta.url).pathname,
    `src/infrastructure/persistence/database/migrations/${filename}`,
    `./src/infrastructure/persistence/database/migrations/${filename}`,
  ];

  for (const path of possiblePaths) {
    try {
      const file = Bun.file(path);
      if (await file.exists()) {
        return await file.text();
      }
    } catch (e) {
      // Continue to next path
      continue;
    }
  }

  throw new Error(
    `Migration file not found: ${filename}. Tried paths: ${possiblePaths.join(", ")}`
  );
}

/**
 * Initialize database schema by running migrations
 */
export async function initializeDatabase(): Promise<void> {
  console.log("🔄 Running database migrations...");

  try {
    const db = getDatabase();

    // Create migrations tracking table (PostgreSQL syntax)
    await db`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    console.log("✅ Migrations table ready");

    // Load and run migrations
    const migrationFiles = ["001_initial_schema.sql", "002_add_user_profiles.sql"];

    for (const filename of migrationFiles) {
      // Check if migration already executed
      const checkResult = await db`
        SELECT * FROM migrations WHERE filename = ${filename}
      `;

      const existing =
        Array.isArray(checkResult) && checkResult.length > 0
          ? checkResult[0]
          : checkResult;

      if (existing && (existing as any).filename) {
        console.log(`⏭️  Migration already executed: ${filename}`);
        continue;
      }

      try {
        const migrationSQL = await loadMigration(filename);

        console.log(`📝 Executing migration: ${filename}`);
        
        // Execute migration SQL - split by semicolon but handle multi-line statements properly
        // Remove comments first
        const cleanedSQL = migrationSQL
          .split("\n")
          .filter((line) => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith("--") && !trimmed.startsWith("/*");
          })
          .join("\n");

        // Split by semicolon, but keep track of statement boundaries
        const statements = cleanedSQL
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        // Execute each statement separately
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i];
          if (statement.trim()) {
            try {
              await db.unsafe(statement + ";");
            } catch (stmtError) {
              console.error(`   Error in statement ${i + 1}/${statements.length}:`, stmtError);
              throw stmtError;
            }
          }
        }

        // Record migration using template tag with parameter
        await db`
          INSERT INTO migrations (filename) VALUES (${filename})
        `;

        console.log(`✅ Migration executed: ${filename}`);
      } catch (error) {
        console.error(`❌ Error executing migration ${filename}:`, error);
        if (error instanceof Error) {
          console.error(`   Error details: ${error.message}`);
        }
        throw error;
      }
    }

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Note: Database initialization should be called explicitly on application startup
// This prevents auto-initialization during tests or module imports
// Call initializeDatabase() in your application entry point (e.g., index.ts)
