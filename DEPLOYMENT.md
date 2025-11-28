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

Railway provides PostgreSQL + Node.js hosting with automatic deployments from GitHub.

### Setup Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create New Project in Railway Dashboard**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub Repo"
   - Choose your `user-management-api` repository
   - Railway will auto-detect the monorepo structure

3. **Configure Service Settings**
   - In Settings → Source:
     - **Root Directory**: Leave EMPTY (blank)
     - **Watch Paths**: Leave empty
   - Railway will use the root `Dockerfile` which builds from `backend/`

4. **Add PostgreSQL Database**
   - In your project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway auto-generates `DATABASE_URL` and other connection variables
   - These are automatically shared with your backend service

5. **Configure Backend Environment Variables**
   
   In Railway dashboard (Variables tab), add these variables:
   ```bash
   # Generate secrets with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   JWT_ACCESS_SECRET=<32-char-secret>
   JWT_REFRESH_SECRET=<different-32-char-secret>
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   NODE_ENV=production
   CORS_ORIGIN=*
   ```
   
   **Important:** 
   - Do NOT add `PORT` - Railway provides this automatically
   - Do NOT add `DATABASE_URL` - Auto-provided by PostgreSQL service
   - Do NOT add individual DB variables (DB_HOST, DB_PORT, etc.) - Use `DATABASE_URL`

6. **Generate Public Domain**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Enter port: `8080` (Railway auto-assigns, but confirm in logs)
   - Copy the generated URL: `https://your-app.up.railway.app`

7. **Deploy**
   - Railway automatically deploys on push to `master` branch
   - Or deploy manually: `railway up` (from backend directory)

8. **Verify Deployment**
   ```bash
   # Test API
   curl https://your-app.up.railway.app/api
   
   # View Swagger docs
   open https://your-app.up.railway.app/api/docs
   ```

### Important Configuration Notes

**Root Dockerfile:**
The project uses a root `Dockerfile` that copies from `backend/` directory:
```dockerfile
# Copies backend package files
COPY backend/package*.json ./

# Copies backend source
COPY backend/ .
```

**Database Configuration:**
The backend `database.config.ts` supports both development and production:
- **Development**: Uses individual env vars (DB_HOST, DB_PORT, etc.)
- **Production**: Uses `DATABASE_URL` from Railway
- SSL is automatically enabled in production

**Port Configuration:**
Railway assigns ports dynamically via `$PORT` environment variable. The backend reads:
```typescript
const port = process.env.PORT || configService.get<number>('app.port') || 3000;
```

### Troubleshooting

**Build fails with "Dockerfile not found":**
- Ensure Root Directory is EMPTY in Settings
- Dockerfile must be in repository root
- Push changes to trigger rebuild

**Connection refused errors:**
- Check app is listening on `0.0.0.0` not `localhost`
- Verify PORT is not hardcoded
- Check public domain port matches app port

**Database connection timeout:**
- Verify `DATABASE_URL` is set (check Variables tab)
- Ensure PostgreSQL service is running
- Check database service is in same project

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

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection | Auto-provided by Railway | ✅ Auto |
| `JWT_ACCESS_SECRET` | Access token secret (32+ chars) | Generate with crypto | ✅ Manual |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | Generate with crypto | ✅ Manual |
| `JWT_ACCESS_EXPIRATION` | Access token lifetime | `15m` | ✅ Manual |
| `JWT_REFRESH_EXPIRATION` | Refresh token lifetime | `7d` | ✅ Manual |
| `NODE_ENV` | Environment | `production` | ✅ Manual |
| `CORS_ORIGIN` | Allowed frontend origins | `*` or `https://app.vercel.app` | ✅ Manual |
| `PORT` | Server port | Auto-provided by Railway | ❌ Don't set |
| `DB_HOST`, `DB_PORT`, etc. | Individual DB vars | Not needed with DATABASE_URL | ❌ Don't set |

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
