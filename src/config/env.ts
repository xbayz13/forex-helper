/**
 * Environment Configuration
 * 
 * Validates and exports environment variables with type safety
 * Bun automatically loads .env file, so we just need to validate
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string;
  
  // Server
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  API_URL: string;
  
  // Optional
  AUTO_INIT_DB?: string;
  LOG_LEVEL?: string;
  CORS_ORIGINS?: string;
  JWT_SECRET?: string;
}

/**
 * Validate required environment variables
 */
function validateEnv(): EnvConfig {
  const required = [
    "DATABASE_URL",
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      `Please create a .env file with DATABASE_URL.\n` +
      `Example: DATABASE_URL=postgresql://user:password@localhost:5432/forex_helper`
    );
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    NODE_ENV: (process.env.NODE_ENV || "development") as "development" | "production" | "test",
    API_URL: process.env.API_URL || process.env.PORT 
      ? `http://localhost:${process.env.PORT || 3000}` 
      : "http://localhost:3000",
    AUTO_INIT_DB: process.env.AUTO_INIT_DB,
    LOG_LEVEL: process.env.LOG_LEVEL,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    JWT_SECRET: process.env.JWT_SECRET,
  };
}

/**
 * Exported environment configuration
 * Throws error if required variables are missing
 */
export const env = validateEnv();

/**
 * Check if running in development mode
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Check if running in production mode
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Check if running in test mode
 */
export const isTest = env.NODE_ENV === "test";


