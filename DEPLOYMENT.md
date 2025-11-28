# Deployment Guide

This guide covers deploying the User Management application to production.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Railway Deployment (Backend)](#railway-deployment-backend)
3. [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

## Quick Start

The application is already deployed and running:
- **Backend**: https://user-management-api-production-6366.up.railway.app/api
- **Frontend**: https://user-management-frontend-lake.vercel.app
- **API Docs**: https://user-management-api-production-6366.up.railway.app/api/docs

For local development with Docker:
```bash
docker-compose up -d
```

Access at http://localhost:5173 (frontend) and http://localhost:3000/api (backend).

## Railway Deployment (Backend)

Railway hosts the backend API with PostgreSQL database and automatic deployments from GitHub.

### Initial Setup

1. Create a new project on https://railway.app
2. Connect your GitHub repository
3. Add PostgreSQL database (Railway auto-generates `DATABASE_URL`)
4. Configure environment variables (see below)
5. Railway auto-deploys on push to master branch

### Key Configuration

**Root Directory**: Leave empty - Railway uses the root Dockerfile which builds from `backend/`

**Environment Variables** (set in Railway dashboard):
```bash
JWT_ACCESS_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-different-32-char-secret>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Important**: Do NOT set `PORT` or `DATABASE_URL` - Railway provides these automatically.

### Database Migrations

Migrations run automatically on each deployment via `docker-entrypoint.sh`. Check deployment logs for:
```
Data Source initialized
Migrations completed
```

To run migrations manually if needed:
```bash
railway shell
node dist/data-source.js
```

## Vercel Deployment (Frontend)

### Setup

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

4. Deploy - Vercel auto-deploys on push to master

## Environment Variables

### Backend (Railway)

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | Auto-provided | (Railway generates) |
| `JWT_ACCESS_SECRET` | Yes | Generate 32+ char random string |
| `JWT_REFRESH_SECRET` | Yes | Generate 32+ char random string |
| `JWT_ACCESS_EXPIRATION` | Yes | `15m` |
| `JWT_REFRESH_EXPIRATION` | Yes | `7d` |
| `NODE_ENV` | Yes | `production` |
| `CORS_ORIGIN` | Yes | `https://your-app.vercel.app` |
| `PORT` | Auto-provided | (Railway assigns) |

### Frontend (Vercel)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.railway.app/api` |

## Troubleshooting

### Backend Issues

**Build fails**: Ensure Dockerfile is in repository root and Root Directory is empty in Railway settings.

**Database connection fails**: Verify `DATABASE_URL` exists in Railway variables. PostgreSQL service must be in same project.

**Migrations don't run**: Check deployment logs for migration output. Run manually if needed: `railway shell` then `node dist/data-source.js`

**CORS errors**: Update `CORS_ORIGIN` to match your Vercel frontend URL.

### Frontend Issues

**Can't reach backend**: Verify `VITE_API_URL` in Vercel environment variables points to your Railway backend.

**Build fails**: Check that frontend dependencies are installed and `package-lock.json` is committed.

### Health Checks

```bash
# Backend health
curl https://your-backend.railway.app/api

# View API documentation
open https://your-backend.railway.app/api/docs

# Frontend health
open https://your-app.vercel.app
```

## Monitoring

**Railway logs**: `railway logs` or check dashboard  
**Vercel logs**: View in Vercel dashboard under Deployments

---

For local development setup, see main [README.md](README.md)
