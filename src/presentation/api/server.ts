/**
 * API Server Setup
 * Integrates API routes with Bun.serve
 */

import { createApiRoutes } from "./app";
import { setupApi } from "./setup";
import { Routes } from "./router";

export function createApiServerRoutes(): Routes {
  // Setup all dependencies
  const dependencies = setupApi();

  // Create API routes
  const apiRoutes = createApiRoutes(dependencies);

  return apiRoutes;
}

