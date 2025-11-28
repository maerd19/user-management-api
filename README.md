# User Management API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)

> Production-ready full-stack user management application with JWT authentication

**Live Demo:**  
🌐 Frontend: https://user-management-frontend-lake.vercel.app  
📚 API Docs: https://user-management-api-production-6366.up.railway.app/api/docs

## 🎯 Project Status

**✅ 100% Complete - Production Ready**

All 10 development phases completed and deployed:
- ✅ **Phase 1-7**: Core functionality (Auth, Users, Frontend, Logging)
- ✅ **Phase 8**: Documentation (README, Swagger, Winston logging)
- ✅ **Phase 9**: Containerization & CI/CD (Docker, GitHub Actions)
- ✅ **Phase 10**: Production Deployment (Railway + Vercel)

## ✨ Features

- ✅ User Registration with email/password validation
- ✅ User Login with JWT access and refresh tokens
- ✅ Dual token strategy (15m access, 7d refresh)
- ✅ Profile management (view and update)
- ✅ User listing with pagination
- ✅ Protected routes with JWT guards
- ✅ Request/response logging with Winston
- ✅ Interactive Swagger API documentation
- ✅ Responsive React UI with Tailwind CSS v4
- ✅ Global error handling and validation
- ✅ Docker multi-stage builds
- ✅ Automatic database migrations on deployment
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Production deployment (Railway + Vercel)

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend Framework | NestJS 11 + TypeScript 5.7 |
| Frontend Framework | React 18 + TypeScript + Vite 7 |
| Database | PostgreSQL 16 |
| ORM | TypeORM 0.3 |
| Authentication | JWT (Passport.js) + bcrypt |
| Logging | Winston 3 |
| API Documentation | Swagger/OpenAPI |
| State Management | Zustand |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Railway + Vercel |

## 📦 Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm or yarn
- Docker & Docker Compose (optional, recommended)

## ⚡ Quick Start

```bash
# Clone repository
git clone <repository-url>
cd aura

# Option 1: Docker (recommended)
docker-compose up -d

# Option 2: Manual setup
# Terminal 1 - Database
docker-compose up -d postgres

# Terminal 2 - Backend
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run start:dev

# Terminal 3 - Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

Access the application at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/api/docs (Swagger UI)

## 🔐 Environment Variables

### Backend (`backend/.env`)

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=user_management

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```bash
VITE_API_URL=http://localhost:3000/api
```

## 🗄 Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations (after backend setup)
cd backend
npm run migration:run

# Verify connection
npm run migration:show
```

## 🚀 Running the Application

### Development Mode

```bash
# Start all services with Docker
docker-compose up

# Or run individually:
# 1. Database
docker-compose up -d postgres

# 2. Backend
cd backend && npm run start:dev

# 3. Frontend
cd frontend && npm run dev
```

### Production Mode

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📚 API Documentation

Interactive Swagger documentation is available at **http://localhost:3000/api/docs** when the backend is running.

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user with email, password, firstName, lastName |
| POST | `/api/auth/login` | No | Login and receive access + refresh tokens |
| POST | `/api/auth/refresh` | Refresh Token | Exchange refresh token for new access token |

### User Management Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | Access Token | Get current authenticated user profile |
| PATCH | `/api/users/profile` | Access Token | Update current user (firstName, lastName) |
| GET | `/api/users` | Access Token | List all users with pagination (page, limit) |
| GET | `/api/users/:id` | Access Token | Get user by UUID |
| PATCH | `/api/users/:id` | Access Token | Update user by UUID |
| DELETE | `/api/users/:id` | Access Token | Delete user by UUID |

### Example Requests

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📁 Project Structure

```
aura/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication (register, login, refresh)
│   │   │   └── users/        # User management (CRUD, profile)
│   │   ├── config/           # Configuration files (app, database, jwt, logger)
│   │   ├── database/         # TypeORM migrations and entities
│   │   └── shared/           # Shared utilities (filters, interceptors, decorators)
│   ├── logs/                 # Application logs (gitignored)
│   └── test/                 # E2E tests
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Reusable UI components (Button, Input, Card)
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── UsersPage.tsx
│   │   ├── store/           # Zustand state management
│   │   ├── lib/             # Utilities and API client
│   │   └── App.tsx          # Main app with routing
│   └── public/              # Static assets
├── docker-compose.yml        # Docker orchestration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🧪 Testing & Quality Assurance

```bash
# Backend linting and build validation
cd backend
npm run lint              # ESLint check
npm run build             # TypeScript compilation

# Frontend linting and build validation  
cd frontend
npm run lint              # ESLint check
npm run build             # Production build
```

### CI/CD Pipeline
GitHub Actions automatically runs on every push:
- ✅ Linting (ESLint)
- ✅ TypeScript compilation
- ✅ Build validation
- ✅ Security scanning with Trivy
- ✅ PostgreSQL integration tests

**Note**: Unit and E2E test suites are planned for future enhancements.

## 🚢 Deployment

**Status**: ✅ **LIVE IN PRODUCTION**

### Production URLs
- **Frontend**: https://user-management-frontend-lake.vercel.app
- **Backend API**: https://user-management-api-production-6366.up.railway.app/api
- **API Docs (Swagger)**: https://user-management-api-production-6366.up.railway.app/api/docs

### Deployment Stack
- **Backend API**: Railway (PostgreSQL 16 + NestJS 11)
- **Frontend**: Vercel (React 18 + Vite SSG)
- **Database**: Railway PostgreSQL with automatic migrations on deploy
- **CI/CD**: GitHub Actions (linting, build validation, security scanning)

### Deployment Features
- ✅ Automatic migrations on container startup
- ✅ Zero-downtime deployments
- ✅ Environment variables securely managed
- ✅ HTTPS/SSL enabled on all endpoints
- ✅ CORS configured for production domains
- ✅ Health checks and monitoring

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🏗 Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend Framework | NestJS 11 | Enterprise-grade architecture, built-in DI, excellent TypeScript support, modular design |
| Database | PostgreSQL 16 | ACID compliance, robust features, excellent TypeORM support, production-ready |
| ORM | TypeORM 0.3 | Decorator-based entities, migration support, active maintenance |
| Authentication | JWT (Access 15m + Refresh 7d) | Stateless, scalable, industry standard, enhanced security with dual tokens |
| Password Hashing | bcrypt (12 rounds) | Proven security, adaptive work factor, resistant to rainbow tables |
| Logging | Winston 3 | Structured logging, multiple transports, production-grade |
| API Documentation | Swagger/OpenAPI | Interactive docs, type-safe, industry standard |
| Frontend Framework | React 18 + TypeScript | Component reusability, strong typing, large ecosystem, excellent tooling |
| State Management | Zustand | Minimal boilerplate, simple API, no providers needed, <1KB bundle |
| Styling | Tailwind CSS v4 | Utility-first, rapid prototyping, tree-shaking, consistent design system |
| Build Tool | Vite 7 | Lightning-fast HMR, modern tooling, optimized production builds |
| HTTP Client | Axios | Interceptor support, automatic JSON handling, broad browser support |
| Routing | React Router v6 | Nested routes, data loading, modern API |

For detailed architectural decision records (ADRs), see the commits and inline documentation.

## 🔮 Future Improvements

**Planned Enhancements:**
- Email verification with confirmation tokens
- Password reset with secure email flow
- User avatar upload with S3/CloudFlare R2
- Role-based access control (RBAC) with admin/user roles
- User search and advanced filtering
- Rate limiting with Redis
- Comprehensive test coverage (unit + integration + E2E)
- Performance monitoring with APM tools
- Security headers and CSRF protection
- Database backups and disaster recovery
- Multi-language support (i18n)

## 📄 License

MIT

---

**Note**: This project is **production-ready** and fully deployed. All 10 phases of development have been completed following the technical design document. The application is live and operational with automatic database migrations, comprehensive logging, API documentation, and CI/CD pipeline.

**Developed by**: Ivan Alejandro Hernandez Angeles  
**Repository**: https://github.com/maerd19/user-management-api  
**Development Time**: 5 days (November 24-28, 2025)
