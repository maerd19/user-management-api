# User Management API - Technical Design Document

> **Comprehensive Full-Stack Application Design with Production Infrastructure**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
   - 2.1 [Backend Architecture (NestJS)](#21-backend-architecture-nestjs)
   - 2.2 [Frontend Architecture (React)](#22-frontend-architecture-react)
   - 2.3 [System Architecture Diagram](#23-system-architecture-diagram)
3. [Data Model & Database Design](#3-data-model--database-design)
   - 3.1 [User Entity](#31-user-entity)
   - 3.2 [Schema Definition](#32-schema-definition)
   - 3.3 [Migration Strategy](#33-migration-strategy)
4. [API Specification](#4-api-specification)
   - 4.1 [Authentication Endpoints](#41-authentication-endpoints)
   - 4.2 [User Endpoints](#42-user-endpoints)
   - 4.3 [Health Endpoints](#43-health-endpoints)
5. [Authentication & Security Design](#5-authentication--security-design)
   - 5.1 [JWT Token Strategy](#51-jwt-token-strategy)
   - 5.2 [Authentication Flows](#52-authentication-flows)
   - 5.3 [Security Measures](#53-security-measures)
6. [Frontend Application Design](#6-frontend-application-design)
   - 6.1 [State Management](#61-state-management)
   - 6.2 [Component Architecture](#62-component-architecture)
   - 6.3 [Route Protection](#63-route-protection)
7. [User Journey & Navigation](#7-user-journey--navigation)
8. [Testing Strategy](#8-testing-strategy)
   - 8.1 [Backend Testing](#81-backend-testing)
   - 8.2 [Frontend Testing](#82-frontend-testing)
9. [Deployment & Infrastructure](#9-deployment--infrastructure)
   - 9.1 [Containerization Strategy](#91-containerization-strategy)
   - 9.2 [Docker Configuration](#92-docker-configuration)
   - 9.3 [CI/CD Pipeline](#93-cicd-pipeline)
   - 9.4 [Cloud Deployment Guides](#94-cloud-deployment-guides)
   - 9.5 [Environment Variables](#95-environment-variables)
10. [Project Structure](#10-project-structure)
11. [Technical Decisions Summary](#11-technical-decisions-summary)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Future Improvements](#13-future-improvements)

---

## 1. Executive Summary

This document provides the complete architectural blueprint for a production-ready user management application featuring JWT-based authentication, a RESTful API, and a modern React frontend. The solution emphasizes security, maintainability, scalability, and deployment best practices.

**Key Deliverables:**
- Full-stack application with NestJS backend and React frontend
- Secure JWT authentication with access/refresh token strategy
- PostgreSQL database with TypeORM migrations
- Containerized deployment with Docker
- CI/CD pipeline with GitHub Actions
- Production deployment on Railway (backend) and Vercel (frontend)

**Technology Stack:**

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

---

## 2. Architecture Overview

### 2.1 Backend Architecture (NestJS)

**Framework Selection Rationale:**

| Criteria | NestJS | Express |
|----------|--------|---------|
| Structure | Built-in modular architecture | Manual setup required |
| TypeScript | First-class support | Additional configuration |
| Dependency Injection | Native DI container | Third-party libraries |
| Validation | Integrated with class-validator | Manual setup |
| Testing | Built-in testing utilities | Manual configuration |
| Documentation | Swagger/OpenAPI out of the box | Additional setup |

NestJS provides enterprise-grade structure that directly addresses evaluation criteria around modular architecture and separation of responsibilities.

**Architecture Pattern: Feature-Based Modular**

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Auth Module │  │Users Module │  │  Health Module      │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────┤  │
│  │ Controller  │  │ Controller  │  │ Controller          │  │
│  │ Service     │  │ Service     │  │ Indicators          │  │
│  │ DTOs        │  │ DTOs        │  └─────────────────────┘  │
│  │ Strategies  │  │ Repository  │                           │
│  │ Guards      │  │ Entity      │  ┌─────────────────────┐  │
│  └─────────────┘  └─────────────┘  │   Shared Module     │  │
│                                    │ Guards | Filters    │  │
│                                    │ Interceptors        │  │
│                                    │ Decorators          │  │
│                                    └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Database Module (TypeORM + PostgreSQL)                  ││
│  │ Config Module (Environment Variables)                   ││
│  │ Logger Module (Structured Logging)                      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Separation Principles:**

| Component | Responsibility |
|-----------|----------------|
| Controllers | Handle HTTP requests/responses only |
| Services | Business logic orchestration |
| Repositories | Data access abstraction |
| DTOs | Input validation and transformation |
| Entities | Database schema definitions |
| Guards | Authorization logic |
| Interceptors | Cross-cutting concerns |
| Filters | Centralized error handling |

### 2.2 Frontend Architecture (React)

**Technology Choices:**

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Library | React 18+ | Component-based, large ecosystem |
| Language | TypeScript (strict) | Type safety, better DX |
| Build Tool | Vite | Fast HMR, modern tooling |
| Styling | Tailwind CSS | Utility-first, rapid development |
| HTTP Client | Axios | Interceptors, request transformation |
| State Management | Zustand | Lightweight, minimal boilerplate |
| Routing | React Router v6 | Standard, feature-rich |
| Form Handling | React Hook Form + Zod | Performance, validation, type inference |

**Architecture Pattern: Feature-Based with Custom Hooks**

```
┌─────────────────────────────────────────────────────────────┐
│                        Pages Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐   │
│  │LoginPage │ │RegisterP.│ │ Dashboard │ │ ProfilePage  │   │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘ └──────┬───────┘   │
├───────┴────────────┴─────────────┴──────────────┴───────────┤
│                     Components Layer                         │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │ UI Components│ │Form Components│ │ Layout Components │   │
│  └──────┬───────┘ └──────┬───────┘ └─────────┬──────────┘   │
├─────────┴────────────────┴───────────────────┴──────────────┤
│                      Hooks Layer                             │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │  useAuth     │ │  useUsers    │ │   useProfile       │   │
│  └──────┬───────┘ └──────┬───────┘ └─────────┬──────────┘   │
├─────────┴────────────────┴───────────────────┴──────────────┤
│                    Services Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Service (Axios Instance)             │   │
│  │    Auth Service  │  User Service  │  Profile Service  │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      Store Layer (Zustand)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    user | token | isAuthenticated | actions           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│    ┌─────────────────────┐                                          │
│    │      USERS          │                                          │
│    │   (Web Browser)     │                                          │
│    └──────────┬──────────┘                                          │
│               │ HTTPS                                                │
│               ▼                                                      │
│    ┌─────────────────────┐         ┌─────────────────────┐          │
│    │      VERCEL         │         │      RAILWAY        │          │
│    │  ┌───────────────┐  │         │  ┌───────────────┐  │          │
│    │  │   Frontend    │  │  API    │  │    Backend    │  │          │
│    │  │  (React SPA)  │──┼────────►│  │   (NestJS)   │  │          │
│    │  │               │  │         │  │               │  │          │
│    │  └───────────────┘  │         │  └───────┬───────┘  │          │
│    │                     │         │          │          │          │
│    │  • CDN Edge Cache   │         │          │ SQL      │          │
│    │  • Auto HTTPS       │         │          ▼          │          │
│    │  • Global Deploy    │         │  ┌───────────────┐  │          │
│    └─────────────────────┘         │  │  PostgreSQL   │  │          │
│                                    │  │   (Railway)   │  │          │
│                                    │  └───────────────┘  │          │
│                                    └─────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model & Database Design

### 3.1 User Entity

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
├─────────────────────────────────────────────────────────────┤
│  PK  │ id          │ UUID         │ NOT NULL, AUTO-GEN     │
├──────┼─────────────┼──────────────┼────────────────────────┤
│      │ email       │ VARCHAR(255) │ NOT NULL, UNIQUE       │
│      │ password    │ VARCHAR(255) │ NOT NULL (hashed)      │
│      │ firstName   │ VARCHAR(100) │ NOT NULL               │
│      │ lastName    │ VARCHAR(100) │ NOT NULL               │
│      │ createdAt   │ TIMESTAMP    │ NOT NULL, AUTO-GEN     │
│      │ updatedAt   │ TIMESTAMP    │ NOT NULL, AUTO-UPDATE  │
└──────┴─────────────┴──────────────┴────────────────────────┘
```

**Field Specifications:**

| Field | Type | Constraints | Validation Rules |
|-------|------|-------------|------------------|
| `id` | UUID | PK, NOT NULL | Auto-generated v4 UUID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Valid format, lowercase, trimmed |
| `password` | VARCHAR(255) | NOT NULL | Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special. Never returned in responses |
| `firstName` | VARCHAR(100) | NOT NULL | 2-100 chars, alphabetic with spaces/hyphens |
| `lastName` | VARCHAR(100) | NOT NULL | 2-100 chars, alphabetic with spaces/hyphens |
| `createdAt` | TIMESTAMP | NOT NULL | Auto-set on creation, immutable |
| `updatedAt` | TIMESTAMP | NOT NULL | Auto-updated on modification |

**TypeORM Entity:**

```typescript
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  @Index('idx_users_email')
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 3.2 Schema Definition

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_email_format CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT users_first_name_length CHECK (LENGTH(first_name) >= 2),
    CONSTRAINT users_last_name_length CHECK (LENGTH(last_name) >= 2)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_full_name ON users(first_name, last_name);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Index Strategy:**

| Index | Columns | Rationale |
|-------|---------|-----------|
| `idx_users_email` | email | Login queries, uniqueness |
| `idx_users_created_at` | created_at DESC | Default list sorting |
| `idx_users_full_name` | first_name, last_name | Name search queries |

### 3.3 Migration Strategy

```
migrations/
├── 1737000000000-CreateUsersTable.ts
├── 1737000000001-AddEmailIndex.ts
└── 1737000000002-SeedTestUsers.ts (optional)
```

**Commands:**
```bash
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
npm run migration:show
```

---

## 4. API Specification

**Base Configuration:**
```
Base URL: /api
Content-Type: application/json
Authentication: Bearer Token (JWT)
```

### 4.1 Authentication Endpoints

#### POST /api/auth/register

| Property | Value |
|----------|-------|
| Authentication | None |
| Rate Limit | 5 req/min per IP |

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss1",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Errors:** `400` Validation | `409` Email exists | `429` Rate limited

---

#### POST /api/auth/login

| Property | Value |
|----------|-------|
| Authentication | None |
| Rate Limit | 10 req/min per IP |

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss1"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  },
  "message": "Login successful"
}
```

**Errors:** `400` Validation | `401` Invalid credentials | `429` Rate limited

---

#### POST /api/auth/refresh

| Property | Value |
|----------|-------|
| Authentication | Refresh Token |
| Rate Limit | 10 req/min |

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

### 4.2 User Endpoints

#### GET /api/users/profile

| Property | Value |
|----------|-------|
| Authentication | Required |
| Rate Limit | 100 req/min |

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

#### PUT /api/users/profile

| Property | Value |
|----------|-------|
| Authentication | Required |
| Rate Limit | 20 req/min |

**Request (partial update):**
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe"
}
```

**Response (200):** Updated user object

---

#### GET /api/users

| Property | Value |
|----------|-------|
| Authentication | Required |
| Rate Limit | 50 req/min |

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 100) |
| sortBy | string | createdAt | Sort field |
| order | string | DESC | ASC or DESC |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### 4.3 Health Endpoints

#### GET /api/health

Basic health check for load balancers.

**Response (200):**
```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } }
}
```

#### GET /api/health/live

Liveness probe for container orchestration.

#### GET /api/health/ready

Readiness probe with database connectivity check.

---

## 5. Authentication & Security Design

### 5.1 JWT Token Strategy

**Dual Token System:**

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN CONFIGURATION                       │
├─────────────────────────────────────────────────────────────┤
│  Access Token                                                │
│  ├─ Algorithm: HS256 (HMAC-SHA256)                          │
│  ├─ Expiration: 15 minutes                                  │
│  ├─ Payload: { sub: userId, email, type: 'access' }         │
│  └─ Storage: Memory (React state)                           │
├─────────────────────────────────────────────────────────────┤
│  Refresh Token                                               │
│  ├─ Algorithm: HS256 (HMAC-SHA256)                          │
│  ├─ Expiration: 7 days                                      │
│  ├─ Payload: { sub: userId, type: 'refresh' }               │
│  └─ Storage: localStorage (httpOnly cookie preferred)       │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Authentication Flows

**Registration Flow:**
```
Client                    Server                    Database
  │  POST /auth/register    │                          │
  │ ────────────────────►   │                          │
  │                         │  Check email exists      │
  │                         │ ────────────────────────►│
  │                         │  Hash password (bcrypt)  │
  │                         │  INSERT user             │
  │                         │ ────────────────────────►│
  │   201 + User data       │                          │
  │ ◄────────────────────   │                          │
  │  Redirect to /login     │                          │
```

**Login Flow:**
```
Client                    Server                    Database
  │  POST /auth/login       │                          │
  │ ────────────────────►   │                          │
  │                         │  SELECT user by email    │
  │                         │ ────────────────────────►│
  │                         │  Compare password hash   │
  │                         │  Generate JWT tokens     │
  │ 200 + tokens + user     │                          │
  │ ◄────────────────────   │                          │
  │  Store tokens           │                          │
  │  Redirect to /dashboard │                          │
```

**Token Refresh Flow:**
```
Client                    Server
  │  Request fails with 401 │
  │ ◄────────────────────   │
  │  POST /auth/refresh     │
  │  { refreshToken }       │
  │ ────────────────────►   │
  │                         │  Verify refresh token
  │                         │  Generate new access token
  │  200 + new accessToken  │
  │ ◄────────────────────   │
  │  Retry original request │
  │ ────────────────────►   │
```

### 5.3 Security Measures

| Measure | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with 12 salt rounds |
| Password Policy | Min 8 chars, uppercase, lowercase, number, special |
| Token Security | Short-lived access tokens, separate secrets |
| Rate Limiting | Per-endpoint limits, IP-based |
| CORS | Whitelist production origins |
| Input Validation | class-validator on all DTOs |
| SQL Injection | TypeORM parameterized queries |
| XSS Prevention | React escaping, CSP headers |

---

## 6. Frontend Application Design

### 6.1 State Management

**Zustand Auth Store:**

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  updateProfile: (data: UpdateProfileDTO) => Promise<void>;
  clearError: () => void;
  hydrate: () => void;
}
```

**State Machine:**
```
┌─────────────────────────────────────────────────────────────┐
│                    AUTH STATE MACHINE                        │
├─────────────────────────────────────────────────────────────┤
│   ┌─────────────┐                                           │
│   │   IDLE      │ ◄────────────────────────────────────┐    │
│   │ (logged out)│                                      │    │
│   └──────┬──────┘                                      │    │
│          │ login() / register()                        │    │
│          ▼                                             │    │
│   ┌─────────────┐                                      │    │
│   │  LOADING    │                                      │    │
│   └──────┬──────┘                                      │    │
│    ┌─────┴─────┐                                       │    │
│    ▼           ▼                                       │    │
│ ┌──────┐  ┌──────────────┐                             │    │
│ │ERROR │  │AUTHENTICATED │                             │    │
│ └───┬──┘  └─────┬────────┘                             │    │
│     │           │ logout() / token expired             │    │
│     └───────────┴──────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Component Architecture

```
App
├── PublicLayout
│   ├── Header (Logo)
│   └── Routes
│       ├── LoginPage
│       │   ├── LoginForm
│       │   └── RegisterLink
│       └── RegisterPage
│           ├── RegisterForm
│           └── LoginLink
│
└── ProtectedLayout
    ├── Header (Logo, Nav, UserMenu)
    └── Routes
        ├── Dashboard
        │   ├── WelcomeCard
        │   ├── ProfileSummary
        │   └── RecentUsersTable
        ├── ProfilePage
        │   └── ProfileEditForm
        └── UsersPage
            ├── UsersTable
            └── Pagination
```

### 6.3 Route Protection

```
┌─────────────────────────────────────────────────────────────┐
│                  ROUTE PROTECTION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│  User navigates to /dashboard                               │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────┐                                    │
│  │ ProtectedRoute      │                                    │
│  └──────────┬──────────┘                                    │
│             ▼                                                │
│  ┌─────────────────────┐     NO      ┌──────────────────┐   │
│  │ isAuthenticated?    │ ──────────► │ Redirect /login  │   │
│  └──────────┬──────────┘             └──────────────────┘   │
│             │ YES                                            │
│             ▼                                                │
│  ┌─────────────────────┐     YES     ┌──────────────────┐   │
│  │ Token expired?      │ ──────────► │ Attempt refresh  │   │
│  └──────────┬──────────┘             └────────┬─────────┘   │
│             │ NO                              │              │
│             ▼                                 ▼              │
│  ┌─────────────────────┐     SUCCESS: Continue              │
│  │ Render children     │     FAILURE: Redirect /login       │
│  └─────────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

**Application Routes:**

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/` | HomePage | Public | Landing, redirect if logged in |
| `/login` | LoginPage | Public | Login form |
| `/register` | RegisterPage | Public | Registration form |
| `/dashboard` | Dashboard | Protected | Main authenticated area |
| `/profile` | ProfilePage | Protected | View/edit profile |
| `/users` | UsersPage | Protected | User listing |

---

## 7. User Journey & Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│                       USER JOURNEY MAP                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  NEW USER FLOW                                                       │
│  ══════════════                                                      │
│  Landing (/) ──► Register (/register) ──► Login (/login)            │
│                                               │                      │
│                                               ▼                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    DASHBOARD (/dashboard)                    │    │
│  │  ┌───────────────────────────────────────────────────────┐  │    │
│  │  │  Welcome, {firstName}!                                 │  │    │
│  │  │                                                        │  │    │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │    │
│  │  │  │ Profile Card │  │ Quick Stats  │  │   Actions   │  │  │    │
│  │  │  │ {name}       │  │ Total Users  │  │ [Edit Prof] │  │  │    │
│  │  │  │ {email}      │  │ {count}      │  │ [View Users]│  │  │    │
│  │  │  └──────────────┘  └──────────────┘  │ [Logout]    │  │  │    │
│  │  │                                       └─────────────┘  │  │    │
│  │  │  ┌──────────────────────────────────────────────────┐ │  │    │
│  │  │  │              RECENT USERS TABLE                   │ │  │    │
│  │  │  │                        [View All Users →]         │ │  │    │
│  │  │  └──────────────────────────────────────────────────┘ │  │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  PROFILE EDIT: Dashboard → Profile Page → Update → Dashboard        │
│  LOGOUT: Any Protected Route → Clear tokens → Login Page            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Testing Strategy

### 8.1 Backend Testing

```
┌─────────────────────────────────────────────────────────────┐
│                      TEST PYRAMID                            │
├─────────────────────────────────────────────────────────────┤
│                          /\                                  │
│                         /  \                                 │
│                        / E2E\         ← Few, slow, costly    │
│                       /______\                               │
│                      /        \                              │
│                     /Integration\     ← Some, moderate       │
│                    /______________\                          │
│                   /                \                         │
│                  /    Unit Tests    \ ← Many, fast, cheap    │
│                 /____________________\                       │
└─────────────────────────────────────────────────────────────┘
```

| Type | Tools | Coverage |
|------|-------|----------|
| Unit | Jest | Services, utilities, DTOs |
| Integration | Jest + Supertest | Controllers + Services + DB |
| E2E | Jest + Supertest | Complete API flows |

**Unit Test Example:**
```typescript
describe('AuthService', () => {
  describe('register', () => {
    it('should hash password before saving');
    it('should throw ConflictException if email exists');
    it('should return user without password');
  });
  
  describe('login', () => {
    it('should return tokens for valid credentials');
    it('should throw UnauthorizedException for invalid password');
  });
});
```

### 8.2 Frontend Testing

| Type | Tools | Coverage |
|------|-------|----------|
| Unit | Vitest | Hooks, services, utilities |
| Component | Vitest + Testing Library | UI components |
| Integration | Vitest + MSW | Components with API mocking |

**Coverage Goals:**

| Area | Target |
|------|--------|
| Backend Services | 80%+ |
| Backend Controllers | 70%+ |
| Frontend Hooks | 80%+ |
| Frontend Components | 60%+ |

---

## 9. Deployment & Infrastructure

### 9.1 Containerization Strategy

**Why Docker?**

| Factor | Benefit |
|--------|---------|
| Consistency | Identical dev/staging/prod environments |
| Reproducibility | Eliminates "works on my machine" |
| Onboarding | Single `docker-compose up` command |
| Platform Support | First-class Railway/Render support |
| Scalability | Container-ready for orchestration |

### 9.2 Docker Configuration

#### Backend Dockerfile (Multi-Stage)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main.js"]
```

#### Frontend Dockerfile (Multi-Stage with Nginx)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_URL
ARG VITE_APP_NAME
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production with Nginx
FROM nginx:alpine AS runner
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Docker Compose (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: user-mgmt-db
    environment:
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_DATABASE:-user_management}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      target: deps
    container_name: user-mgmt-api
    command: npm run start:dev
    environment:
      NODE_ENV: development
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:-postgres}
      DB_DATABASE: ${DB_DATABASE:-user_management}
      JWT_SECRET: ${JWT_SECRET:-dev-secret}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET:-dev-refresh-secret}
      CORS_ORIGIN: http://localhost:5173
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      target: deps
    container_name: user-mgmt-ui
    command: npm run dev -- --host 0.0.0.0
    environment:
      VITE_API_URL: http://localhost:3000/api
      VITE_APP_NAME: User Management
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
```

### 9.3 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run build

  frontend-ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy-backend:
    needs: [backend-ci, frontend-ci]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @railway/cli
      - run: railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: [backend-ci, frontend-ci]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g vercel
      - run: vercel --prod --yes
        working-directory: ./frontend
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### 9.4 Cloud Deployment Guides

#### Railway (Backend + Database)

**1. Install CLI and initialize:**
```bash
npm install -g @railway/cli
railway login
cd backend && railway init
```

**2. Add PostgreSQL:**
```bash
railway add --plugin postgresql
```

**3. Configure environment variables in Railway Dashboard:**
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<openssl rand -base64 64>
JWT_REFRESH_SECRET=<openssl rand -base64 64>
CORS_ORIGIN=https://your-app.vercel.app
```

**4. Create railway.toml:**
```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/main.js"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
```

**5. Deploy:**
```bash
railway up
railway domain  # Get your URL
```

#### Vercel (Frontend)

**1. Create vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**2. Configure environment variables in Vercel Dashboard:**
```bash
VITE_API_URL=https://your-api.railway.app/api
VITE_APP_NAME=User Management
```

**3. Deploy:**
```bash
npm install -g vercel
cd frontend
vercel link
vercel --prod
```

### 9.5 Environment Variables

#### Development (.env)

**Backend:**
```bash
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=user_management
JWT_SECRET=dev-secret-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_REFRESH_EXPIRATION=7d
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGIN=http://localhost:5173
```

**Frontend:**
```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=User Management
```

#### Production

**Backend:**
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=<64-char-secure-random>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_SECRET=<64-char-secure-random>
JWT_REFRESH_EXPIRATION=7d
THROTTLE_TTL=60
THROTTLE_LIMIT=30
CORS_ORIGIN=https://your-app.vercel.app
LOG_LEVEL=info
```

**Frontend:**
```bash
VITE_API_URL=https://your-api.railway.app/api
VITE_APP_NAME=User Management
```

---

## 10. Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   └── jwt.config.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── dto/
│   │   │   │   ├── strategies/
│   │   │   │   └── guards/
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   └── health/
│   │   │       └── health.controller.ts
│   │   ├── database/
│   │   │   └── migrations/
│   │   └── shared/
│   │       ├── decorators/
│   │       ├── filters/
│   │       └── interceptors/
│   ├── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── railway.toml
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── forms/
│   │   │   └── layout/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── routes/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitignore
└── README.md
```

---

## 11. Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend Framework | NestJS | Built-in modularity, DI, TypeScript support |
| Database | PostgreSQL | Robust, ACID-compliant, excellent TypeORM support |
| ORM | TypeORM | Decorator-based entities, migration support |
| Authentication | JWT (Access + Refresh) | Stateless, scalable, industry standard |
| Password Hashing | bcrypt (12 rounds) | Proven security, adjustable work factor |
| Frontend Framework | React + TypeScript | Component-based, type safety, large ecosystem |
| State Management | Zustand | Lightweight, simple API, no boilerplate |
| Form Handling | React Hook Form + Zod | Performance, validation, type inference |
| Styling | Tailwind CSS | Utility-first, rapid development |
| Build Tool | Vite | Fast HMR, modern tooling |
| Containerization | Docker | Reproducibility, deployment consistency |
| CI/CD | GitHub Actions | Native GitHub integration, free tier |
| Backend Hosting | Railway | Simple deployment, managed PostgreSQL |
| Frontend Hosting | Vercel | Edge CDN, automatic HTTPS, preview deploys |

---

## 12. Implementation Roadmap

### Commit Convention

```
<type>(<scope>): <description>

Types: feat | fix | docs | style | refactor | test | chore
```

### Documentation Strategy

> **CRITICAL:** Documentation is NOT deferred to the end. The README and supporting docs are built progressively with each phase, using ONLY verified, working code as source material.

**Documentation Artifacts to Produce:**

| Artifact | Location | Created In | Final Update |
|----------|----------|------------|--------------|
| Main README | `README.md` | Phase 1 | Phase 10 |
| Backend README | `backend/README.md` | Phase 2 | Phase 4 |
| Frontend README | `frontend/README.md` | Phase 5 | Phase 7 |
| Backend .env.example | `backend/.env.example` | Phase 2 | Phase 9 |
| Frontend .env.example | `frontend/.env.example` | Phase 5 | Phase 9 |
| API Documentation | `docs/API_DOCUMENTATION.md` | Phase 3 | Phase 4 |
| Architecture Decisions | `docs/ARCHITECTURE_DECISIONS.md` | Phase 2 | Phase 8 |
| Deployment Guide | `DEPLOYMENT.md` | Phase 9 | Phase 10 |
| Changelog | `CHANGELOG.md` | Phase 1 | Phase 10 |

---

### Phase 1: Project Setup

**Commits:**
```
chore: initialize monorepo structure with backend and frontend directories
chore(backend): initialize NestJS project with TypeScript strict mode
chore(frontend): initialize React project with Vite and TypeScript
chore: add docker-compose for local PostgreSQL database
docs: add initial README with project overview
docs: initialize CHANGELOG.md
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `README.md` | CREATE | Project title, description, tech stack table, project status badge, table of contents (placeholder sections) |
| `CHANGELOG.md` | CREATE | Initial entry with project setup commits |
| `.gitignore` | CREATE | Standard ignores for Node.js, IDE, OS files |

**README Update - Phase 1:**
```markdown
## Sections to include:
- # User Management API (title)
- Project description (2-3 sentences)
- ## Tech Stack (table with Backend/Frontend/Database/Infrastructure)
- ## Project Status: 🚧 In Development
- ## Table of Contents (with placeholder links)
- ## Quick Start (placeholder: "Coming soon...")
```

**Validation & Testing:**
- Verify both projects compile without errors (`npm run build`)
- Confirm `docker-compose up` starts PostgreSQL and is accessible on port 5432
- Manual check: backend starts with `npm run start:dev`, frontend with `npm run dev`
- README renders correctly on GitHub
- **Criteria to advance:** All projects build, database healthy, README visible on repo

---

### Phase 2: Backend Infrastructure

**Commits:**
```
feat(backend): add config module with environment validation
feat(backend): configure TypeORM with PostgreSQL connection
feat(backend): create User entity with all required fields
feat(backend): add database migration for users table
feat(backend): add global exception filter for consistent error responses
feat(backend): add response transformation interceptor
docs(backend): create backend README with setup instructions
docs(backend): add .env.example with all variables
docs: initialize ARCHITECTURE_DECISIONS.md
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `backend/README.md` | CREATE | Backend-specific setup, scripts, structure |
| `backend/.env.example` | CREATE | All env vars with descriptions and example values |
| `docs/ARCHITECTURE_DECISIONS.md` | CREATE | ADR-001: NestJS selection, ADR-002: TypeORM selection |
| `README.md` | UPDATE | Add "Database Setup" section |
| `CHANGELOG.md` | UPDATE | Add Phase 2 entries |

**README Update - Phase 2:**
```markdown
## Sections to add/update in main README:
- ## Prerequisites (Node.js 20+, PostgreSQL 16+, Docker)
- ## Database Setup
  - Docker command to start PostgreSQL
  - Migration commands (npm run migration:run)
  - Connection verification steps
- ## Environment Variables (link to backend/.env.example)

## backend/README.md content:
- # Backend - NestJS API
- ## Tech Stack (NestJS, TypeORM, PostgreSQL, JWT)
- ## Project Structure (src/ folder tree)
- ## Available Scripts (start:dev, build, test, migration:*)
- ## Environment Variables (full table with descriptions)
```

**backend/.env.example content:**
```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=user_management

# JWT (to be added in Phase 3)
# JWT_SECRET=
# JWT_ACCESS_EXPIRATION=
# JWT_REFRESH_SECRET=
# JWT_REFRESH_EXPIRATION=
```

**Validation & Testing:**
- Run unit tests for config module (`npm run test -- config`)
- Verify database connection via `docker-compose up` and TypeORM logs
- Execute migrations: `npm run migration:run` completes without errors
- Smoke test: API starts and responds to `GET /api/health` with 200
- backend/.env.example contains all required variables
- **Criteria to advance:** Migrations run, health responds, env.example complete

---

### Phase 3: Authentication Module

**Commits:**
```
feat(backend): create auth module structure
feat(backend): add register DTO with class-validator decorators
feat(backend): implement user registration with password hashing
feat(backend): add login DTO and credentials validation
feat(backend): implement JWT token generation service
feat(backend): add JWT strategy and auth guard
feat(backend): implement login endpoint with token response
feat(backend): add refresh token endpoint
test(backend): add unit tests for auth service
test(backend): add integration tests for auth endpoints
docs: create API_DOCUMENTATION.md with auth endpoints
docs(backend): update .env.example with JWT variables
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `docs/API_DOCUMENTATION.md` | CREATE | Full auth endpoint specs with curl examples |
| `backend/.env.example` | UPDATE | Add JWT_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION |
| `docs/ARCHITECTURE_DECISIONS.md` | UPDATE | ADR-003: JWT dual-token strategy, ADR-004: bcrypt selection |
| `README.md` | UPDATE | Add "API Documentation" section with link |
| `CHANGELOG.md` | UPDATE | Add Phase 3 entries |

**README Update - Phase 3:**
```markdown
## Sections to add/update in main README:
- ## API Documentation (link to docs/API_DOCUMENTATION.md)
- ## Authentication
  - Brief explanation of JWT strategy
  - Token expiration times
  - Link to full API docs

## docs/API_DOCUMENTATION.md content:
- # API Documentation
- ## Base URL: /api
- ## Authentication
  - ### POST /api/auth/register
    - Request body (with validation rules)
    - Success response (201) with real example
    - Error responses (400, 409, 429)
    - curl example
  - ### POST /api/auth/login
    - Request/response examples
    - curl example
  - ### POST /api/auth/refresh
    - Request/response examples
    - curl example
```

**Validation & Testing:**
- Unit tests: AuthService (password hashing, token generation, validation)
- Integration tests: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- Manual flow: Register → Login → Verify token in response → Use token in protected request
- Verify bcrypt rounds (12) and JWT expiration times match config
- All curl examples in API_DOCUMENTATION.md work as documented
- **Criteria to advance:** Auth tests pass (≥80%), integration tests pass, curl examples verified

---

### Phase 4: Users Module

**Commits:**
```
feat(backend): create users module structure
feat(backend): implement get profile endpoint
feat(backend): add update profile DTO with partial validation
feat(backend): implement update profile endpoint
feat(backend): add pagination DTO for list queries
feat(backend): implement list users endpoint with pagination
feat(backend): add current-user decorator for route handlers
test(backend): add unit tests for users service
test(backend): add integration tests for users endpoints
docs: update API_DOCUMENTATION.md with users endpoints
docs(backend): finalize backend README
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `docs/API_DOCUMENTATION.md` | UPDATE | Add all users endpoints with examples |
| `backend/README.md` | FINALIZE | Complete structure, all scripts, test commands |
| `README.md` | UPDATE | Add "API Endpoints Summary" table |
| `CHANGELOG.md` | UPDATE | Add Phase 4 entries |

**README Update - Phase 4:**
```markdown
## Sections to add/update in main README:
- ## API Endpoints Summary (table format)
  | Method | Endpoint | Auth | Description |
  |--------|----------|------|-------------|
  | POST | /api/auth/register | No | Register new user |
  | POST | /api/auth/login | No | Login and get tokens |
  | POST | /api/auth/refresh | Token | Refresh access token |
  | GET | /api/users/profile | Yes | Get current user profile |
  | PUT | /api/users/profile | Yes | Update current user profile |
  | GET | /api/users | Yes | List all users (paginated) |

## docs/API_DOCUMENTATION.md additions:
- ## Users
  - ### GET /api/users/profile
  - ### PUT /api/users/profile
  - ### GET /api/users (with pagination params)
  - All with curl examples using Bearer token
```

**Validation & Testing:**
- Unit tests: UsersService (CRUD operations, pagination logic)
- Integration tests: `GET /users/profile`, `PUT /users/profile`, `GET /users`
- Test authorization: endpoints reject requests without valid JWT (401)
- Test pagination: verify `page`, `limit`, `totalPages` calculations
- All new curl examples verified working
- **Criteria to advance:** Users tests pass (≥80%), API docs complete and verified

---

### Phase 5: Frontend Core Setup

**Commits:**
```
feat(frontend): configure Tailwind CSS
feat(frontend): add base UI components (Button, Input, Card, Alert, Loading)
feat(frontend): create axios instance with base configuration
feat(frontend): add auth store with Zustand
feat(frontend): configure React Router with route structure
feat(frontend): add protected route component
docs(frontend): create frontend README with setup instructions
docs(frontend): add .env.example
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `frontend/README.md` | CREATE | Frontend-specific setup, components, structure |
| `frontend/.env.example` | CREATE | VITE_API_URL, VITE_APP_NAME |
| `README.md` | UPDATE | Add "Frontend Setup" section |
| `CHANGELOG.md` | UPDATE | Add Phase 5 entries |

**README Update - Phase 5:**
```markdown
## Sections to add/update in main README:
- ## Frontend Setup
  - cd frontend && npm install
  - npm run dev
  - Access at http://localhost:5173

## frontend/README.md content:
- # Frontend - React Application
- ## Tech Stack (React 18, TypeScript, Vite, Tailwind, Zustand)
- ## Project Structure (src/ folder tree)
- ## Available Scripts (dev, build, test, lint)
- ## Environment Variables
- ## Component Library (list of UI components)
```

**frontend/.env.example content:**
```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Application
VITE_APP_NAME=User Management
```

**Validation & Testing:**
- Unit tests: Zustand auth store (initial state, actions)
- Component tests: UI components render correctly with props
- Manual check: Navigate between routes, verify redirects for unauthenticated users
- Verify Tailwind classes apply correctly in browser
- **Criteria to advance:** Store tests pass, components render, routing works

---

### Phase 6: Authentication UI

**Commits:**
```
feat(frontend): create public layout component
feat(frontend): implement login page with form validation
feat(frontend): add auth service for API calls
feat(frontend): implement login functionality with store integration
feat(frontend): implement register page with form validation
feat(frontend): add register functionality with redirect to login
feat(frontend): add axios interceptor for token refresh
test(frontend): add tests for auth store
test(frontend): add tests for login form
docs: update README with test credentials
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `README.md` | UPDATE | Add test credentials section, full-stack run instructions |
| `CHANGELOG.md` | UPDATE | Add Phase 6 entries |

**README Update - Phase 6:**
```markdown
## Sections to add/update in main README:
- ## Running the Full Stack
  - Step 1: Start database (docker-compose up -d postgres)
  - Step 2: Start backend (cd backend && npm run start:dev)
  - Step 3: Start frontend (cd frontend && npm run dev)
  - Step 4: Access http://localhost:5173

- ## Test Credentials
  - Register a new user or use seeded data (if applicable)
  - Example: email: test@example.com, password: Test@123

- ## Features Implemented
  - ✅ User Registration
  - ✅ User Login
  - ✅ JWT Authentication
  - ✅ Token Refresh
  - 🚧 Dashboard (coming next)
```

**Validation & Testing:**
- Unit tests: Auth store actions (login, logout, register, refreshToken)
- Component tests: LoginForm, RegisterForm (validation errors, loading states, submit handling)
- Integration test with MSW: Mock API responses, verify store updates
- Manual E2E flow: Register new user → Login → Verify dashboard access → Logout → Verify redirect
- Test token refresh: Simulate expired token, verify automatic refresh and retry
- **Criteria to advance:** Auth store tests pass (≥80%), form validations work, E2E flow functional

---

### Phase 7: Dashboard and Profile

**Commits:**
```
feat(frontend): create protected layout with header and navigation
feat(frontend): implement dashboard page with welcome section
feat(frontend): add profile summary card to dashboard
feat(frontend): implement profile page with view mode
feat(frontend): add profile edit form functionality
feat(frontend): add user service for API calls
feat(frontend): implement users list page with table
feat(frontend): add pagination component for users list
test(frontend): add tests for profile form
test(frontend): add tests for users table
docs(frontend): finalize frontend README
docs: update main README with all features
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `frontend/README.md` | FINALIZE | Complete component list, all routes, state management |
| `README.md` | UPDATE | Update features list, add screenshots placeholder |
| `CHANGELOG.md` | UPDATE | Add Phase 7 entries |

**README Update - Phase 7:**
```markdown
## Sections to add/update in main README:
- ## Features Implemented (update)
  - ✅ User Registration
  - ✅ User Login
  - ✅ JWT Authentication
  - ✅ Token Refresh
  - ✅ Dashboard
  - ✅ Profile View/Edit
  - ✅ Users List with Pagination

- ## Application Routes
  | Route | Access | Description |
  |-------|--------|-------------|
  | /login | Public | Login page |
  | /register | Public | Registration page |
  | /dashboard | Protected | Main dashboard |
  | /profile | Protected | User profile |
  | /users | Protected | Users list |

- ## Screenshots (placeholder or actual)
```

**Validation & Testing:**
- Component tests: ProfileForm (edit mode, validation, submit), UsersTable (rendering, pagination)
- Unit tests: User service methods
- Integration test: Profile update flow with MSW mocks
- Manual E2E flow: Login → View dashboard → Edit profile → Save → Verify update → View users list → Navigate pages
- Verify loading states and error handling display correctly
- **Criteria to advance:** Component tests pass (≥60%), all CRUD flows work E2E

---

### Phase 8: Polish and Documentation

**Commits:**
```
style(backend): add request logging interceptor
style(frontend): improve error message display
fix(frontend): handle token expiration gracefully
docs: finalize API_DOCUMENTATION.md with all examples
docs: finalize ARCHITECTURE_DECISIONS.md
docs: add technical decisions section to README
docs: add future improvements section to README
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `docs/API_DOCUMENTATION.md` | FINALIZE | All endpoints, error codes, rate limits |
| `docs/ARCHITECTURE_DECISIONS.md` | FINALIZE | All ADRs with context, decision, consequences |
| `README.md` | UPDATE | Technical decisions, future improvements |
| `CHANGELOG.md` | UPDATE | Add Phase 8 entries |

**README Update - Phase 8:**
```markdown
## Sections to add/update in main README:
- ## Technical Decisions
  | Decision | Choice | Rationale |
  |----------|--------|-----------|
  | Backend Framework | NestJS | Modularity, DI, TypeScript |
  | Database | PostgreSQL | ACID, TypeORM support |
  | Authentication | JWT | Stateless, scalable |
  | Frontend | React + Vite | Fast HMR, modern tooling |
  | State Management | Zustand | Lightweight, simple |
  | Styling | Tailwind CSS | Utility-first, rapid dev |

- ## Future Improvements
  - Email verification
  - Password reset
  - Role-based access control
  - Redis caching
  - Swagger documentation

- ## Architecture
  - Link to docs/ARCHITECTURE_DECISIONS.md
```

**Validation & Testing:**
- Verify logging interceptor outputs request/response info in dev mode
- Manual test: Trigger various error scenarios, verify user-friendly messages
- Documentation review: All docs render correctly, links work
- Run full test suites: `npm run test` on both backend and frontend
- **Criteria to advance:** All tests pass, documentation complete and reviewed

---

### Phase 9: Containerization & Infrastructure

**Commits:**
```
chore(backend): add Dockerfile with multi-stage build
chore(backend): add .dockerignore file
chore(frontend): add Dockerfile with multi-stage Nginx build
chore(frontend): add .dockerignore and nginx.conf
chore: add docker-compose.prod.yml for production simulation
feat(backend): add health check endpoints (/health, /health/live, /health/ready)
chore: add GitHub Actions CI/CD workflow
docs: create DEPLOYMENT.md with Docker instructions
docs: update env.example files with production variables
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `DEPLOYMENT.md` | CREATE | Docker setup, local Docker run, production prep |
| `backend/.env.example` | UPDATE | Add production-specific vars (DB_SSL, LOG_LEVEL) |
| `frontend/.env.example` | UPDATE | Add production URL placeholder |
| `README.md` | UPDATE | Add Docker instructions section |
| `CHANGELOG.md` | UPDATE | Add Phase 9 entries |

**README Update - Phase 9:**
```markdown
## Sections to add/update in main README:
- ## Running with Docker
  ### Development
  ```bash
  docker-compose up -d
  # Access frontend: http://localhost:5173
  # Access backend: http://localhost:3000
  # Access pgAdmin: http://localhost:5050 (optional)
  ```

  ### Production Simulation
  ```bash
  docker-compose -f docker-compose.prod.yml up -d
  # Access app: http://localhost:80
  ```

- ## Health Checks
  - GET /api/health - Basic health
  - GET /api/health/live - Liveness probe
  - GET /api/health/ready - Readiness probe

## DEPLOYMENT.md content:
- # Deployment Guide
- ## Prerequisites
- ## Docker Build
  - Backend: docker build -t user-mgmt-api ./backend
  - Frontend: docker build -t user-mgmt-ui ./frontend
- ## Environment Variables for Production
- ## Running Locally with Docker
- ## CI/CD Pipeline Overview
```

**Validation & Testing:**
- Build Docker images: `docker build` completes for both services
- Run production simulation: `docker-compose -f docker-compose.prod.yml up`
- Health checks: All containers report healthy status
- Integration test: Full stack works in containerized environment
- CI pipeline: Push to branch, verify GitHub Actions runs all tests and builds
- **Criteria to advance:** Docker images build, containers healthy, CI green

---

### Phase 10: Deployment

**Commits:**
```
chore(backend): add railway.toml configuration
chore(frontend): add vercel.json configuration
chore: add production environment variable templates
docs: finalize DEPLOYMENT.md with Railway/Vercel guide
docs: finalize README with live URLs and complete instructions
docs: finalize CHANGELOG.md with all releases
```

**Documentation Artifacts:**

| File | Action | Content |
|------|--------|---------|
| `DEPLOYMENT.md` | FINALIZE | Complete Railway + Vercel instructions with verified steps |
| `README.md` | FINALIZE | All sections complete, live URLs, badges |
| `CHANGELOG.md` | FINALIZE | Version 1.0.0 release entry |

**README Update - Phase 10 (FINAL):**
```markdown
## Final README.md Structure:

# User Management API

![Build Status](badge)
![License](badge)

> Full-stack user management application with JWT authentication

## 🚀 Live Demo
- Frontend: https://your-app.vercel.app
- Backend API: https://your-api.railway.app

## 📋 Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Project Structure](#project-structure)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Technical Decisions](#technical-decisions)
13. [Future Improvements](#future-improvements)
14. [License](#license)

## ✨ Features
- ✅ User Registration with validation
- ✅ User Login with JWT tokens
- ✅ Access/Refresh token strategy
- ✅ Profile management
- ✅ Users list with pagination
- ✅ Protected routes
- ✅ Dockerized deployment
- ✅ CI/CD pipeline

## 🛠 Tech Stack
(complete table)

## 📦 Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm or yarn

## ⚡ Quick Start
```bash
# Clone repository
git clone https://github.com/user/repo.git
cd repo

# Option 1: Docker (recommended)
docker-compose up -d

# Option 2: Manual
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

## 🔐 Environment Variables
### Backend
(table with all variables, descriptions, examples)

### Frontend
(table with all variables)

## 🗄 Database Setup
(migration commands, seeding if applicable)

## 🚀 Running the Application
### Development
(step-by-step)

### With Docker
(docker-compose commands)

### Production
(link to DEPLOYMENT.md)

## 📚 API Documentation
### Endpoints Summary
(table)

### Authentication
(brief explanation with examples)

Full documentation: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## 📁 Project Structure
```
project-root/
├── backend/
│   └── (structure)
├── frontend/
│   └── (structure)
├── docker-compose.yml
└── README.md
```

## 🧪 Testing
```bash
# Backend tests
cd backend && npm run test

# Frontend tests
cd frontend && npm run test

# E2E tests
npm run test:e2e
```

## 🚢 Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy
- Backend: Railway (one-click)
- Frontend: Vercel (one-click)

## 🏗 Technical Decisions
(summary table, link to ADRs)

## 🔮 Future Improvements
(bullet list)

## 📄 License
MIT
```

**DEPLOYMENT.md Final Structure:**
```markdown
# Deployment Guide

## Railway (Backend)
1. Install CLI: npm install -g @railway/cli
2. Login: railway login
3. Initialize: cd backend && railway init
4. Add PostgreSQL: railway add
5. Set environment variables (list all)
6. Deploy: railway up
7. Get URL: railway domain

## Vercel (Frontend)
1. Install CLI: npm install -g vercel
2. Login: vercel login
3. Initialize: cd frontend && vercel
4. Set environment variables
5. Deploy: vercel --prod

## Environment Variables Reference
### Backend (Production)
(complete list with secure generation commands)

### Frontend (Production)
(complete list)

## Verification Checklist
- [ ] Backend health check responds
- [ ] Frontend loads
- [ ] Registration works
- [ ] Login works
- [ ] Profile update works
- [ ] CORS configured correctly
- [ ] HTTPS working
```

**Validation & Testing:**
- Deploy backend to Railway: Verify health endpoint responds
- Deploy frontend to Vercel: Verify app loads and connects to API
- Smoke tests on production:
  - Register new user
  - Login and access dashboard
  - Update profile
  - View users list
- Verify CORS configuration allows frontend origin
- Check SSL/HTTPS works on both services
- README enables complete setup from scratch in <15 minutes
- All documentation links work
- **Criteria to advance:** Both services deployed, full flow works, docs complete

---

### Test Coverage Summary by Phase

| Phase | Unit Tests | Integration Tests | E2E/Manual |
|-------|------------|-------------------|------------|
| 1-2 | Config, DB modules | DB connection | Health endpoint |
| 3 | AuthService (≥80%) | Auth endpoints | Auth flow |
| 4 | UsersService (≥80%) | Users endpoints | CRUD flow |
| 5-6 | Auth store (≥80%) | MSW mocks | Full auth flow |
| 7 | User service | Component integration | Dashboard flow |
| 8 | Regression suite | - | Error scenarios |
| 9-10 | - | Containerized stack | Production smoke tests |

---

### Documentation Checklist (Final Verification)

Before marking the project complete, verify ALL documentation:

**Main README.md:**
- [ ] Project description matches actual implementation
- [ ] All tech stack items are correct versions
- [ ] Quick Start commands work on fresh clone
- [ ] All environment variables documented
- [ ] API endpoints table is accurate
- [ ] Project structure matches actual files
- [ ] Test commands work
- [ ] Live URLs are correct (if deployed)

**Supporting Documents:**
- [ ] `backend/README.md` - Setup instructions work
- [ ] `frontend/README.md` - Setup instructions work
- [ ] `backend/.env.example` - All variables present with descriptions
- [ ] `frontend/.env.example` - All variables present
- [ ] `docs/API_DOCUMENTATION.md` - All curl examples work
- [ ] `docs/ARCHITECTURE_DECISIONS.md` - All decisions documented
- [ ] `DEPLOYMENT.md` - Steps verified on fresh deployment
- [ ] `CHANGELOG.md` - All phases documented

**Required README Sections (per technical challenge):**
- [ ] Descripción del proyecto ✓
- [ ] Tecnologías utilizadas ✓
- [ ] Instalación y configuración ✓
- [ ] Variables de entorno ✓
- [ ] Configuración de la base de datos ✓
- [ ] Ejecución del backend ✓
- [ ] Ejecución del frontend ✓
- [ ] Documentación de API ✓
- [ ] Decisiones técnicas ✓
- [ ] Mejoras futuras ✓
- [ ] Credenciales de prueba ✓
- [ ] Estructura del proyecto ✓
- [ ] Instrucciones Docker ✓

---

## 13. Future Improvements

### Security Enhancements
- Refresh token rotation
- Account lockout after failed attempts
- CSRF protection
- Audit logging

### Features
- Email verification
- Password reset functionality
- User avatar upload
- Role-based access control (RBAC)
- User search and filtering

### Technical
- Swagger/OpenAPI documentation
- Redis caching
- Graceful shutdown
- Structured logging (Winston/Pino)

### Testing
- E2E tests with Playwright
- Performance testing
- Security scanning (SAST)

### DevOps
- Blue-green deployments
- Monitoring and alerting (Sentry)
- Database backups

---

## Document Information

| Property | Value |
|----------|-------|
| Author | Senior Full-Stack Engineer |
| Version | 2.0 (Consolidated) |
| Status | Design Complete |
| Last Updated | 2025 |

---

*This document serves as the complete technical blueprint for implementation. All configurations are production-ready and have been designed following industry best practices.*
