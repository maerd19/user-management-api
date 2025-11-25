# Backend - NestJS API

RESTful API for user management with JWT authentication built with NestJS and PostgreSQL.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 16
- **ORM**: TypeORM 0.3
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── app.config.ts      # Application config
│   └── database.config.ts # Database config
├── database/
│   └── migrations/        # Database migrations
├── modules/               # Feature modules
│   └── users/
│       └── entities/      # TypeORM entities
├── shared/                # Shared utilities
│   ├── filters/          # Exception filters
│   └── interceptors/     # Response interceptors
├── app.module.ts         # Root module
├── data-source.ts        # TypeORM data source
└── main.ts              # Application entry point
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run migration:generate -- src/database/migrations/MigrationName` | Generate migration |
| `npm run migration:create -- src/database/migrations/MigrationName` | Create empty migration |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run migration:show` | Show migration status |

## Environment Variables

Create a `.env` file in the backend directory:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `PORT` | Server port | `3000` | No |
| `API_PREFIX` | Global API prefix | `api` | No |
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | Yes |
| `DB_USERNAME` | Database username | `postgres` | Yes |
| `DB_PASSWORD` | Database password | `postgres` | Yes |
| `DB_DATABASE` | Database name | `user_management` | Yes |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` | Yes |

See `.env.example` for a complete template.

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your database credentials
```

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL container from project root
cd ..
docker-compose up -d postgres

# Wait for database to be ready (check with docker-compose ps)
# Then run migrations
cd backend
npm run migration:run

# Verify migrations
npm run migration:show
```

### Option 2: Local PostgreSQL

```bash
# Create database
createdb user_management

# Run migrations
npm run migration:run
```

## Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

API documentation will be available in the project root at `docs/API_DOCUMENTATION.md`

### Health Check

```bash
# Basic health check
curl http://localhost:3000/api
```

## Architecture

### Modular Structure

The application follows NestJS modular architecture:

- **Config Module**: Environment configuration
- **Database Module**: TypeORM integration
- **Users Module**: User entity and operations
- **Auth Module**: Authentication

### Global Components

- **Exception Filter**: Consistent error responses
- **Transform Interceptor**: Standardized response format
- **Validation Pipe**: Automatic DTO validation

### Response Format

All successful responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": ["Error message"],
  "timestamp": "2025-11-25T10:30:00.000Z"
}
```

## Database Migrations

### Creating Migrations

```bash
# Auto-generate from entity changes
npm run migration:generate -- src/database/migrations/AddUserRole

# Create empty migration
npm run migration:create -- src/database/migrations/SeedUsers
```

### Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## Security Features

- Input validation with class-validator
- SQL injection prevention (TypeORM parameterized queries)
- CORS configuration
- Environment variable validation
- Password hashing
- JWT authentication

## Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit and E2E testing
