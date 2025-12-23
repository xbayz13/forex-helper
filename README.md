# Forex Trading Helper

A comprehensive Forex trading helper application built with Bun, TypeScript, and React, following Domain-Driven Design (DDD) architecture principles.

## Features

- **Lot Calculator**: Calculate optimal position sizes based on risk management
- **Trade History**: Track and manage all trading transactions
- **Reports & Analytics**: Analyze trading performance with comprehensive metrics
- **Trade Journal**: Document trading strategies and learnings

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **Frontend**: React 19
- **Database**: PostgreSQL (via `Bun.sql()`)
- **Architecture**: Domain-Driven Design (DDD)
- **Testing**: Bun Test
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── domain/                    # Domain Layer (DDD)
│   ├── lot-calculator/
│   ├── trade-history/
│   ├── reports/
│   └── user/
├── application/               # Application Layer
│   ├── lot-calculator/
│   ├── trade-history/
│   ├── reports/
│   └── user/
├── infrastructure/            # Infrastructure Layer
│   ├── persistence/
│   ├── logging/
│   ├── authentication/
│   └── external-services/
├── presentation/             # Presentation Layer
│   ├── api/
│   └── web/
└── shared/                    # Shared Kernel
    ├── di/                    # Dependency Injection
    ├── errors/
    ├── events/
    └── utils/
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed (version 1.0+)

### Installation

1. Install dependencies:
```bash
bun install
```

2. Install linting/formatting dependencies:
```bash
bun add -d eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

3. Setup environment variables:
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and configure your database connection:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/forex_helper
   # Or use individual variables:
   # DB_USER=postgres
   # DB_PASSWORD=postgres
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=forex_helper
   AUTO_INIT_DB=true
   NODE_ENV=development
   ```

### Development

Start the development server:
```bash
bun run dev
```

The server will be available at `http://localhost:3000`

### Database

The application uses **PostgreSQL** via `Bun.sql()`. Bun.sql() provides built-in support for PostgreSQL with automatic connection pooling.

#### Prerequisites

1. **Install PostgreSQL**
   - macOS: `brew install postgresql@15`
   - Linux: `sudo apt-get install postgresql` (Ubuntu/Debian)
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Start PostgreSQL Service**
   - macOS: `brew services start postgresql@15`
   - Linux: `sudo systemctl start postgresql`

3. **Create Database**
   ```sql
   CREATE DATABASE forex_helper;
   ```

#### Configuration

The database connection is configured via environment variables in `.env` file:

**Option 1: Using DATABASE_URL (Recommended)**
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/forex_helper
```

**Option 2: Using Individual Variables**
```bash
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=forex_helper
```

#### Migration System

The database schema is automatically initialized on first run (if `AUTO_INIT_DB=true` in `.env`).

**Automatic Migration:**
- Migrations run automatically on application startup
- Migration files are located in `src/infrastructure/persistence/database/migrations/`
- Executed migrations are tracked in the `migrations` table

**Manual Migration:**
```typescript
import { initializeDatabase } from "@/infrastructure/persistence/database";

await initializeDatabase();
```

#### Database Schema

The initial schema includes:
- `users` - User accounts and authentication
- `trades` - Trading history and transactions
- `migrations` - Migration tracking table

### Testing

Run tests:
```bash
bun test
```

Run tests in watch mode:
```bash
bun run test:watch
```

Run tests with coverage:
```bash
bun run test:coverage
```

### Linting & Formatting

Lint code:
```bash
bun run lint
```

Fix linting issues:
```bash
bun run lint:fix
```

Format code:
```bash
bun run format
```

Check formatting:
```bash
bun run format:check
```

### Type Checking

Run TypeScript type checking:
```bash
bun run typecheck
```

### Building

Build for production:
```bash
bun run build
```

## License

MIT
