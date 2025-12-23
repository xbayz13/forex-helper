/**
 * Test setup file
 * This file is automatically loaded before running tests (via bunfig.toml)
 */

// Global test setup
// Add any global test utilities or mocks here

// Example: Mock environment variables for tests
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/forex_helper_test";
process.env.AUTO_INIT_DB = "false";

// Add any global test helpers here
global.testUtils = {
  // Add test utilities as needed
};

declare global {
  var testUtils: {
    // Define test utility types here
  };
}
