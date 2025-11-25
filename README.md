# User Management API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

> Full-stack user management application with JWT authentication

## 🚧 Project Status: In Development

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Quick Start](#-quick-start)
5. [Environment Variables](#-environment-variables)
6. [Database Setup](#-database-setup)
7. [Running the Application](#-running-the-application)
8. [API Documentation](#-api-documentation)
9. [Project Structure](#-project-structure)
10. [Testing](#-testing)
11. [Deployment](#-deployment)
12. [Technical Decisions](#-technical-decisions)
13. [Future Improvements](#-future-improvements)
14. [License](#-license)

## ✨ Features

- 🚧 User Registration with validation (Coming soon...)
- 🚧 User Login with JWT tokens (Coming soon...)
- 🚧 Access/Refresh token strategy (Coming soon...)
- 🚧 Profile management (Coming soon...)
- 🚧 Users list with pagination (Coming soon...)
- 🚧 Protected routes (Coming soon...)
- 🚧 Dockerized deployment (Coming soon...)
- 🚧 CI/CD pipeline (Coming soon...)

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend Framework | NestJS + TypeScript |
| Frontend Framework | React 18 + TypeScript + Vite |
| Database | PostgreSQL 16 |
| ORM | TypeORM |
| Authentication | JWT (Passport.js) |
| State Management | Zustand |
| Styling | Tailwind CSS |
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
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## 🔐 Environment Variables

### Backend

See `backend/.env.example` for all available environment variables.

### Frontend

See `frontend/.env.example` for all available environment variables.

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

Full API documentation will be available at `docs/API_DOCUMENTATION.md` (Coming soon...)

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login and get tokens |
| POST | /api/auth/refresh | Token | Refresh access token |
| GET | /api/users/profile | Yes | Get current user profile |
| PUT | /api/users/profile | Yes | Update current user profile |
| GET | /api/users | Yes | List all users (paginated) |

## 📁 Project Structure

```
aura/
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── config/      # Configuration
│   │   ├── database/    # Migrations
│   │   └── shared/      # Shared utilities
│   └── test/            # Tests
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   └── store/       # State management
│   └── public/          # Static assets
├── docker-compose.yml   # Docker orchestration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test           # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report

# Frontend tests
cd frontend
npm run test          # Unit tests
npm run test:coverage # Coverage report
```

## 🚢 Deployment

Detailed deployment instructions coming soon in `DEPLOYMENT.md`.

### Quick Deploy

- **Backend**: Railway (PostgreSQL + API)
- **Frontend**: Vercel (Static hosting)

## 🏗 Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend Framework | NestJS | Built-in modularity, DI, TypeScript support |
| Database | PostgreSQL | Robust, ACID-compliant, excellent TypeORM support |
| ORM | TypeORM | Decorator-based entities, migration support |
| Authentication | JWT (Access + Refresh) | Stateless, scalable, industry standard |
| Password Hashing | bcrypt (12 rounds) | Proven security, adjustable work factor |
| Frontend Framework | React + TypeScript | Component-based, type safety, large ecosystem |
| State Management | Zustand | Lightweight, simple API, no boilerplate |
| Styling | Tailwind CSS | Utility-first, rapid development |
| Build Tool | Vite | Fast HMR, modern tooling |
| Containerization | Docker | Reproducibility, deployment consistency |

For detailed architectural decisions, see `docs/ARCHITECTURE_DECISIONS.md` (Coming soon...)

## 🔮 Future Improvements

- Email verification
- Password reset functionality
- User avatar upload
- Role-based access control (RBAC)
- User search and filtering
- Swagger/OpenAPI documentation
- Redis caching
- Monitoring and alerting
- Performance testing
- Security scanning

## 📄 License

MIT

---

**Note**: This project is currently under active development. Features and documentation are being added incrementally following the technical design document.
