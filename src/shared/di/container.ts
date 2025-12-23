/**
 * Simple Dependency Injection Container
 * Implements a lightweight DI container for DDD architecture
 */

type Constructor<T = unknown> = new (...args: any[]) => T;
type Factory<T = unknown> = (...args: any[]) => T;
type Token<T = unknown> = string | symbol | Constructor<T>;

interface ServiceDefinition<T = unknown> {
  factory?: Factory<T>;
  instance?: T;
  singleton?: boolean;
}

class DIContainer {
  private services = new Map<Token, ServiceDefinition>();
  private instances = new Map<Token, unknown>();

  /**
   * Register a service with a factory function
   */
  register<T>(
    token: Token<T>,
    factory: Factory<T>,
    options?: { singleton?: boolean }
  ): void {
    this.services.set(token, {
      factory,
      singleton: options?.singleton ?? true,
    });
  }

  /**
   * Register a service instance directly
   */
  registerInstance<T>(token: Token<T>, instance: T): void {
    this.instances.set(token, instance);
    this.services.set(token, {
      instance,
      singleton: true,
    });
  }

  /**
   * Register a class as a service (auto-instantiate)
   */
  registerClass<T>(
    token: Token<T>,
    constructor: Constructor<T>,
    options?: { singleton?: boolean }
  ): void {
    this.register(
      token,
      () => {
        const dependencies = this.resolveConstructorDependencies(constructor);
        return new constructor(...dependencies);
      },
      options
    );
  }

  /**
   * Resolve a service from the container
   */
  resolve<T>(token: Token<T>): T {
    // Check if instance already exists (singleton)
    if (this.instances.has(token)) {
      return this.instances.get(token) as T;
    }

    // Get service definition
    const definition = this.services.get(token);
    if (!definition) {
      throw new Error(
        `Service not found: ${typeof token === "string" ? token : token.name}`
      );
    }

    // If instance is provided directly
    if (definition.instance) {
      return definition.instance as T;
    }

    // Create instance using factory
    if (definition.factory) {
      const instance = definition.factory();
      
      // Store instance if singleton
      if (definition.singleton) {
        this.instances.set(token, instance);
      }
      
      return instance as T;
    }

    throw new Error(
      `Invalid service definition for: ${typeof token === "string" ? token : token.name}`
    );
  }

  /**
   * Check if a service is registered
   */
  has(token: Token): boolean {
    return this.services.has(token) || this.instances.has(token);
  }

  /**
   * Clear all registered services and instances
   */
  clear(): void {
    this.services.clear();
    this.instances.clear();
  }

  /**
   * Resolve constructor dependencies using reflection (simple implementation)
   * In a real implementation, you might use decorators or metadata
   */
  private resolveConstructorDependencies(
    constructor: Constructor
  ): unknown[] {
    // For now, return empty array
    // In production, you might want to use decorators or parameter metadata
    return [];
  }
}

// Singleton container instance
export const container = new DIContainer();

// Export types and class for advanced usage
export type { Token, Factory, Constructor, ServiceDefinition };
export { DIContainer };

