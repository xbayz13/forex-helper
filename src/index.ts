import { serve } from "bun";
import index from "./index.html";
import { initializeDatabase } from "./infrastructure/persistence/database";
import { env } from "./config/env";
import { createApiServerRoutes } from "./presentation/api/server";
import { Routes } from "./presentation/api/router";

// Initialize database on startup
if (env.AUTO_INIT_DB !== "false") {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    console.error("Please check your DATABASE_URL in .env file");
    process.exit(1);
  }
}

// Create API routes
const apiRoutes = createApiServerRoutes();

// Helper to handle route matching with Bun.serve
function createRouteHandler(routes: Routes) {
  return async (req: Request): Promise<Response | undefined> => {
    const url = new URL(req.url);
    const method = req.method;
    const pathname = url.pathname;

    // Try exact match first
    const exactRoute = routes[pathname];
    if (exactRoute) {
      if (typeof exactRoute === "function") {
        return await exactRoute(req);
      }
      
      const methodHandler = exactRoute[method as keyof typeof exactRoute];
      if (methodHandler && typeof methodHandler === "function") {
        return await methodHandler(req);
      }
    }

    // Try pattern matching for routes with params (e.g., /api/trades/:id)
    for (const [pattern, route] of Object.entries(routes)) {
      if (pattern.includes(":")) {
        const patternParts = pattern.split("/");
        const pathParts = pathname.split("/");
        
        if (patternParts.length === pathParts.length) {
          const params: Record<string, string> = {};
          let matches = true;
          
          for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];
            
            if (patternPart?.startsWith(":")) {
              params[patternPart.substring(1)] = pathPart || "";
            } else if (patternPart !== pathPart) {
              matches = false;
              break;
            }
          }
          
          if (matches) {
            if (typeof route === "function") {
              (req as any).params = params;
              return await route(req);
            }
            
            const methodHandler = route[method as keyof typeof route];
            if (methodHandler && typeof methodHandler === "function") {
              (req as any).params = params;
              return await methodHandler(req);
            }
          }
        }
      }
    }

    // No match found
    return undefined;
  };
}

const apiRouteHandler = createRouteHandler(apiRoutes);

const server = serve({
  async fetch(req: Request) {
    const url = new URL(req.url);
    
    // Handle API routes
    if (url.pathname.startsWith("/api/")) {
      const response = await apiRouteHandler(req);
      if (response) {
        return response;
      }
      // 404 for unmatched API routes
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    
    // Serve index.html for all other routes (frontend)
    return index;
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
console.log(`📡 API endpoints available at ${server.url}api/`);
