/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */

import { errorHandler } from "./errorHandler";

export type RouteHandler = (req: Request) => Promise<Response>;

/**
 * Wraps an async route handler to catch errors and handle them
 */
export function asyncHandler(handler: RouteHandler): RouteHandler {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error);
    }
  };
}

