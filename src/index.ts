import { serve } from "bun";
import { join } from "path";
import plugin from "bun-plugin-tailwind";
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
    try {
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
      
      // Serve static assets (JS, CSS, images, etc.)
      const staticPath = url.pathname.slice(1); // Remove leading slash
      if (staticPath && staticPath !== "index.html") {
        const filePath = join(process.cwd(), "src", staticPath);
        const file = Bun.file(filePath);
        
        if (await file.exists()) {
          // Determine content type
          const ext = staticPath.split('.').pop()?.toLowerCase();
          const contentTypeMap: Record<string, string> = {
            'js': 'application/javascript; charset=utf-8',
            'ts': 'application/javascript; charset=utf-8', // Bun will transpile
            'tsx': 'application/javascript; charset=utf-8', // Bun will transpile
            'css': 'text/css; charset=utf-8',
            'html': 'text/html; charset=utf-8',
            'svg': 'image/svg+xml',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
          };
          
          const contentType = contentTypeMap[ext || ''] || 'application/octet-stream';
          
          // For CSS files, process with Tailwind plugin
          if (ext === 'css') {
            try {
              const result = await Bun.build({
                entrypoints: [filePath],
                target: 'browser',
                format: 'esm',
                minify: false,
                plugins: [plugin],
              });
              
              if (result.success && result.outputs.length > 0) {
                const output = result.outputs[0];
                const processedCss = await output.text();
                
                return new Response(processedCss, {
                  headers: { 
                    'Content-Type': contentType,
                  },
                });
              } else {
                throw new Error(result.logs.join('\n'));
              }
            } catch (error) {
              console.error(`Error processing CSS ${staticPath}:`, error);
              // Fallback to raw file if processing fails
              return new Response(file, {
                headers: { 
                  'Content-Type': contentType,
                },
              });
            }
          }
          
          // For TypeScript/TSX files, we need to transpile them
          if (ext === 'ts' || ext === 'tsx') {
            try {
              // Use Bun.build() to transpile the file
              const result = await Bun.build({
                entrypoints: [filePath],
                target: 'browser',
                format: 'esm',
                minify: false,
                sourcemap: 'inline',
              });
              
              if (result.success && result.outputs.length > 0) {
                const output = result.outputs[0];
                const transpiledCode = await output.text();
                
                return new Response(transpiledCode, {
                  headers: { 
                    'Content-Type': contentType,
                  },
                });
              } else {
                throw new Error(result.logs.join('\n'));
              }
            } catch (error) {
              console.error(`Error transpiling ${staticPath}:`, error);
              return new Response(`Error transpiling file: ${error}`, { 
                status: 500,
                headers: { 'Content-Type': 'text/plain' },
              });
            }
          }
          
          return new Response(file, {
            headers: { 
              'Content-Type': contentType,
            },
          });
        }
      }
      
      // For SPA routing, always serve index.html
      const indexFile = Bun.file(join(process.cwd(), "src", "index.html"));
      if (await indexFile.exists()) {
        return new Response(indexFile, {
          headers: { 
            'Content-Type': 'text/html',
          },
        });
      }
      
      return new Response("Not found", { status: 404 });
    } catch (error) {
      console.error("Error serving request:", error);
      return new Response("Internal server error", { status: 500 });
    }
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
