/**
 * Error Handler Middleware
 * Centralized error handling for API responses
 */

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export class AppError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(error: unknown): Response {
  console.error("API Error:", error);

  // Handle known AppError
  if (error instanceof AppError) {
    return Response.json(
      {
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
      { status: error.status }
    );
  }

  // Handle validation errors
  if (error instanceof Error && error.name === "ValidationError") {
    return Response.json(
      {
        error: {
          message: error.message,
          code: "VALIDATION_ERROR",
        },
      },
      { status: 400 }
    );
  }

  // Handle unknown errors
  return Response.json(
    {
      error: {
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
    },
    { status: 500 }
  );
}

