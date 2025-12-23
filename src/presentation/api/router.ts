/**
 * Router Helper
 * Helper functions for routing with Bun.serve
 */

export interface RouteHandler {
  GET?: (req: Request) => Promise<Response> | Response;
  POST?: (req: Request) => Promise<Response> | Response;
  PUT?: (req: Request) => Promise<Response> | Response;
  DELETE?: (req: Request) => Promise<Response> | Response;
  PATCH?: (req: Request) => Promise<Response> | Response;
  [key: string]: ((req: Request) => Promise<Response> | Response) | undefined;
}

export type Routes = Record<string, RouteHandler | ((req: Request) => Promise<Response> | Response)>;

/**
 * Match route pattern with URL
 * Returns params if match, null otherwise
 */
function matchRoute(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart?.startsWith(":")) {
      // Parameter match
      const paramName = patternPart.substring(1);
      params[paramName] = pathPart || "";
    } else if (patternPart !== pathPart) {
      // Exact match required
      return null;
    }
  }

  return params;
}

/**
 * Find matching route handler
 */
export function findRouteHandler(
  routes: Routes,
  method: string,
  pathname: string
): { handler: (req: Request) => Promise<Response> | Response; params?: Record<string, string> } | null {
  // Try exact match first
  const exactRoute = routes[pathname];
  if (exactRoute) {
    if (typeof exactRoute === "function") {
      return { handler: exactRoute };
    }
    
    const methodHandler = exactRoute[method];
    if (methodHandler) {
      return { handler: methodHandler };
    }
  }

  // Try pattern matching
  for (const [pattern, route] of Object.entries(routes)) {
    if (pattern.includes(":")) {
      const params = matchRoute(pattern, pathname);
      if (params !== null) {
        if (typeof route === "function") {
          return { handler: route, params };
        }
        
        const methodHandler = route[method];
        if (methodHandler) {
          return { handler: methodHandler, params };
        }
      }
    }
  }

  return null;
}

/**
 * Create Bun.serve routes handler
 */
export function createRoutesHandler(routes: Routes) {
  return async (req: Request): Promise<Response | undefined> => {
    const url = new URL(req.url);
    const method = req.method;
    const pathname = url.pathname;

    const match = findRouteHandler(routes, method, pathname);

    if (match) {
      // Attach params to request
      if (match.params) {
        (req as any).params = match.params;
      }

      try {
        return await match.handler(req);
      } catch (error) {
        // Error should be handled by asyncHandler middleware
        throw error;
      }
    }

    // No match found, return undefined to let Bun.serve handle it
    return undefined;
  };
}

