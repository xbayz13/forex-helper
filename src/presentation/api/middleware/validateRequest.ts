/**
 * Request Validation Middleware
 * Validates request body and query parameters
 */

import { AppError } from "./errorHandler";

export interface ValidationSchema {
  body?: Record<string, (value: unknown) => boolean | string>;
  query?: Record<string, (value: unknown) => boolean | string>;
  params?: Record<string, (value: unknown) => boolean | string>;
}

export function validateRequest(schema: ValidationSchema) {
  return async (req: Request): Promise<Request> => {
    const errors: string[] = [];

    // Validate body if schema provided
    if (schema.body && req.method !== "GET" && req.method !== "HEAD") {
      try {
        const body = await req.json();
        
        for (const [key, validator] of Object.entries(schema.body)) {
          const value = body[key];
          const result = validator(value);
          
          if (result !== true) {
            errors.push(result || `${key} is invalid`);
          }
        }
      } catch (error) {
        errors.push("Invalid JSON body");
      }
    }

    // Validate query parameters
    if (schema.query) {
      const url = new URL(req.url);
      
      for (const [key, validator] of Object.entries(schema.query)) {
        const value = url.searchParams.get(key);
        const result = validator(value);
        
        if (result !== true) {
          errors.push(result || `query parameter ${key} is invalid`);
        }
      }
    }

    // Validate route parameters (handled by route handler)
    if (schema.params) {
      // Route params are typically handled by the routing framework
      // This is a placeholder for future implementation
    }

    if (errors.length > 0) {
      throw new AppError(400, "Validation failed", "VALIDATION_ERROR", { errors });
    }

    return req;
  };
}

// Common validators
export const validators = {
  required: (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return "This field is required";
    }
    return true;
  },
  
  string: (value: unknown) => {
    if (typeof value !== "string") {
      return "Must be a string";
    }
    return true;
  },
  
  number: (value: unknown) => {
    if (typeof value !== "number" && isNaN(Number(value))) {
      return "Must be a number";
    }
    return true;
  },
  
  email: (value: unknown) => {
    if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Must be a valid email address";
    }
    return true;
  },
  
  min: (min: number) => (value: unknown) => {
    const num = Number(value);
    if (isNaN(num) || num < min) {
      return `Must be at least ${min}`;
    }
    return true;
  },
  
  max: (max: number) => (value: unknown) => {
    const num = Number(value);
    if (isNaN(num) || num > max) {
      return `Must be at most ${max}`;
    }
    return true;
  },
};

