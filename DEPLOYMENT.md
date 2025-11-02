# Menoo Deployment Guide for Render.com Free Tier

## Overview

This document provides **agent-executable instructions** for deploying Menoo to Render.com's free tier. Menoo is a recipe management system with a Python/Litestar backend and Preact frontend.

**Architecture**: Monolithic deployment with single web service embedding frontend, using PostgreSQL database.

---

## AGENT EXECUTION PLAN

### Task 1: Add PostgreSQL Driver

**Action**: Update `backend/pyproject.toml` to add `asyncpg` driver.

**File**: `backend/pyproject.toml`

**Change**: In the `dependencies` list, add `"asyncpg",` after `"aiosqlite",`

**Expected result**:
```toml
dependencies = [
    "litestar[standard]",
    "sqlalchemy[asyncio]",
    "alembic",
    "aiosqlite",
    "asyncpg",          # For PostgreSQL
    "pydantic",
    "pydantic-settings",
    "python-dotenv",
    "structlog",
    "httpx",
    "marvin",
    "openai",
    "aiolimiter",
]
```

---

### Task 2: Create render.yaml

**Action**: Create `render.yaml` at repository root.

**File**: `render.yaml` (new file at root)

**Content**:
```yaml
services:
  - type: web
    name: menoo
    runtime: python
    plan: free
    autoDeploy: true
    branch: main
    buildCommand: |
      pip install --upgrade pip setuptools wheel
      pip install -e backend/.
      cd frontend && npm install && npm run build
      cp -r frontend/dist/* backend/app/static/
    startCommand: |
      cd backend
      # Convert postgresql:// to postgresql+asyncpg:// for async SQLAlchemy
      export DATABASE_URL=$(echo $DATABASE_URL | sed 's|postgresql://|postgresql+asyncpg://|')
      litestar --app app.main:app run --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: menoo-db
          property: connectionString
      - key: ENVIRONMENT
        value: production
      - key: DEBUG
        value: "false"
      - key: LOG_JSON
        value: "true"
      - key: LOG_LEVEL
        value: INFO
      - key: OPENAI_API_KEY
        sync: false
      - key: MARVIN_CACHE_ENABLED
        value: "true"
      - key: MARVIN_CACHE_TTL_SECONDS
        value: "3600"
      - key: SUGGESTION_RATE_LIMIT
        value: "10"
      - key: SUGGESTION_RATE_PERIOD
        value: "60"
      - key: CORS_ALLOWED_ORIGINS
        value: "*"

databases:
  - name: menoo-db
    databaseName: menoo
    user: menoo
    plan: free
```

---

### Task 3: Commit Changes

**Action**: Stage and commit the changes.

**Expected commits**:
1. `chore: add asyncpg driver for PostgreSQL support`
2. `feat: add render.yaml for Render.com deployment`

---

## HUMAN ACTION REQUIRED

### Step 1: Sign up and deploy on Render.com

**Agent**: Request human action

**Instructions for human**:

1. **Sign up for Render.com**
   - Visit https://render.com
   - Sign up with GitHub/GitLab/Bitbucket account
   - Add payment method (required even for free tier)

2. **Create Blueprint**
   - Dashboard → New → Blueprint
   - Connect your Git repository
   - Select branch: `main`
   - Click "Apply"
   - Review configuration
   - Click "Deploy"

3. **Wait for deployment** (~5-10 minutes)

4. **If using AI features**, add `OPENAI_API_KEY`:
   - Go to service settings
   - Add environment variable: `OPENAI_API_KEY`
   - Redeploy

**Agent**: Once human confirms deployment is complete, proceed to verification.

---

### Step 2: Verify Deployment

**Agent**: Run verification tests

**Tests to perform**:
1. Check health endpoint: `curl https://your-app.onrender.com/healthz`
2. Check readiness: `curl https://your-app.onrender.com/readiness`

**Expected response**: `{"status":"ok"}` or `{"status":"ready"}`

**If tests fail**: Check build logs in Render dashboard and report errors to human.

---

## Optional: Custom Domain

**Agent**: Inform human about custom domain option

**Instructions for human** (if needed):
1. Dashboard → Settings → Custom Domains
2. Add your domain (e.g., 'menoo')
3. Follow DNS instructions
4. If domain added, agent should update `render.yaml` CORS settings:
   ```yaml
   - key: CORS_ALLOWED_ORIGINS
     value: "https://your-domain.com"
   ```
5. Commit and push changes

---

## Quick Reference

### Render Free Tier Limitations
- Services spin down after 15 minutes of inactivity (~1 min wake time)
- 750 free instance hours/month
- Postgres expires after 30 days (upgrade to keep data)
- No persistent file storage
- No SSH access

### Auto-Deployment
With `autoDeploy: true`, every push to `main` branch automatically deploys.

### Database
Fresh PostgreSQL database created automatically on first deployment. Tables created on first app startup.

### Monitoring
- Health checks: `https://your-app.onrender.com/healthz`
- Logs: Dashboard → Logs
- Alerts: Configure in Dashboard settings

---

## Troubleshooting

### Build Fails
- Check build logs in Dashboard
- Verify Node.js dependencies build successfully
- Reduce dependencies if build timeout

### Database Connection Error
- Verify DATABASE_URL environment variable set correctly
- Check Postgres database is running in Dashboard
- Ensure using internal database URL

### 502 Bad Gateway
- Service may be spun down (wait 1 minute)
- Check logs for Python errors
- Verify health check `/healthz` works

### Frontend Not Loading
- Verify frontend build copied to `backend/app/static/`
- Check browser console for errors
- Ensure SPA router enabled in `main.py`

---

## References

- [Render Free Tier Docs](https://render.com/docs/free)
- [Render Postgres Docs](https://render.com/docs/databases)
- [Render Python Docs](https://render.com/docs/python)
- [Litestar Deployment](https://docs.litestar.dev/2/guides/deployment.html)

---

## Changelog

- **2025-01-XX**: Agent-executable deployment guide
- Monolithic architecture with PostgreSQL
- Infrastructure-as-code using render.yaml
- Auto-deploy on push to main branch
- Fresh database setup
