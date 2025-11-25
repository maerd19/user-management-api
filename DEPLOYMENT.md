# Deployment Guide

This guide covers deploying the User Management application to production using Docker and cloud platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Deployment](#docker-deployment)
3. [Railway Deployment (Backend)](#railway-deployment-backend)
4. [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
5. [Environment Variables](#environment-variables)
6. [Database Migrations](#database-migrations)
7. [Monitoring and Logs](#monitoring-and-logs)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker and Docker Compose installed
- Railway account (for backend + database)
- Vercel account (for frontend)
- Production environment variables ready

## Docker Deployment

### Local Production Build

```bash
# 1. Create production environment file
cp .env.prod.example .env.prod
# Edit .env.prod with your production values

# 2. Build and start all services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 3. Run database migrations
docker exec aura-backend-prod npm run migration:run

# 4. Verify services
docker-compose -f docker-compose.prod.yml ps
```

### Access Points

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- API Docs: http://localhost:3000/api/docs
- PostgreSQL: localhost:5432

### Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Rebuild after changes
docker-compose -f docker-compose.prod.yml up -d --build

# Clean up (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v
```

## Railway Deployment (Backend)

Railway provides PostgreSQL + Node.js hosting with automatic deployments.

### Setup Steps

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   cd backend
   railway init
   ```

2. **Add PostgreSQL Database**
   - Go to Railway dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Note the connection string

3. **Configure Environment Variables**
   
   In Railway dashboard, add these variables:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<provided by Railway>
   JWT_ACCESS_SECRET=<your-secret>
   JWT_REFRESH_SECRET=<your-secret>
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Run Migrations**
   ```bash
   railway run npm run migration:run
   ```

### Railway Configuration

Create `railway.json` in backend root:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "node dist/main.js",
    "healthcheckPath": "/api",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

## Vercel Deployment (Frontend)

### Setup Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Initialize**
   ```bash
   cd frontend
   vercel login
   vercel
   ```

3. **Configure Environment Variables**
   
   In Vercel dashboard (Settings → Environment Variables):
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

4. **Deploy**
   ```bash
   # Production deployment
   vercel --prod
   ```

### Vercel Configuration

The `vercel.json` is already configured in the frontend directory.

### Automatic Deployments

Connect your GitHub repository to Vercel for automatic deployments:
- Push to `main` → Production deployment
- Push to other branches → Preview deployments

## Environment Variables

### Backend (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection | Auto-provided by Railway |
| `JWT_ACCESS_SECRET` | Access token secret (32+ chars) | `your-secret-here` |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | `different-secret` |
| `JWT_ACCESS_EXPIRATION` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRATION` | Refresh token lifetime | `7d` |
| `CORS_ORIGIN` | Allowed frontend origins | `https://app.vercel.app` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.railway.app/api` |

## Database Migrations

### Railway

```bash
# Run migrations on Railway
railway run npm run migration:run

# Create new migration
railway run npm run migration:generate -- src/database/migrations/MigrationName

# Revert last migration
railway run npm run migration:revert
```

### Docker

```bash
# Run migrations in Docker
docker exec aura-backend-prod npm run migration:run

# Check migration status
docker exec aura-backend-prod npm run migration:show
```

## Monitoring and Logs

### Railway

```bash
# View logs
railway logs

# Follow logs in real-time
railway logs --follow
```

### Docker

```bash
# View logs for all services
docker-compose -f docker-compose.prod.yml logs -f

# View logs for specific service
docker logs -f aura-backend-prod
docker logs -f aura-frontend-prod
```

### Vercel

```bash
# View deployment logs
vercel logs <deployment-url>
```

## Troubleshooting

### Common Issues

**1. Backend won't start**
```bash
# Check logs
railway logs
# or
docker logs aura-backend-prod

# Verify environment variables
railway variables
```

**2. Database connection fails**
```bash
# Test connection
railway run npm run migration:show

# Check DATABASE_URL is set correctly
railway variables | grep DATABASE
```

**3. CORS errors**
```bash
# Verify CORS_ORIGIN matches frontend URL
railway variables | grep CORS

# Update if needed
railway variables set CORS_ORIGIN=https://your-app.vercel.app
```

**4. Migrations fail**
```bash
# Check current migration status
railway run npm run migration:show

# Try reverting last migration
railway run npm run migration:revert

# Re-run migrations
railway run npm run migration:run
```

**5. Frontend can't reach backend**
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend health: `curl https://your-backend.railway.app/api`
- Verify CORS settings in backend

### Health Checks

**Backend:**
```bash
curl https://your-backend.railway.app/api
# Should return: {"message":"Welcome to User Management API"}
```

**Frontend:**
```bash
curl https://your-app.vercel.app/health
# Should return: healthy
```

**Database:**
```bash
railway run npm run migration:show
# Should list all migrations
```

## Security Checklist

Before deploying to production:

- [ ] Change all JWT secrets to strong random values (32+ characters)
- [ ] Set secure database password
- [ ] Configure CORS_ORIGIN to specific frontend domain (not `*`)
- [ ] Enable HTTPS (handled by Railway/Vercel)
- [ ] Review and rotate secrets regularly
- [ ] Enable rate limiting (implement in Phase 8+)
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for database
- [ ] Review and update dependencies regularly
- [ ] Enable security scanning in CI/CD

## Backup and Recovery

### Database Backup (Railway)

```bash
# Export database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore database
railway run psql $DATABASE_URL < backup.sql
```

### Docker Backup

```bash
# Export database
docker exec aura-postgres-prod pg_dump -U postgres user_management > backup.sql

# Restore database
docker exec -i aura-postgres-prod psql -U postgres user_management < backup.sql
```

## Scaling Considerations

- **Railway**: Auto-scales based on usage, configure in dashboard
- **Vercel**: Auto-scales globally on Edge Network
- **Database**: Monitor connections, consider connection pooling for high traffic
- **Caching**: Implement Redis for session/token caching (future enhancement)

---

**Need Help?** Check the main [README.md](../README.md) or review application logs for detailed error messages.
