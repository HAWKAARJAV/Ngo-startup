# Railway Deployment Setup Guide

## Required Environment Variables

Set these in your Railway project settings:

### Database
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Authentication (Supabase)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### AI Integration (Google Gemini)
```
GEMINI_API_KEY=your_gemini_api_key
```

### Application Settings
```
NODE_ENV=production
PRODUCTION_URL=https://your-app.railway.app
```

### Optional
```
PORT=3000
HOSTNAME=0.0.0.0
```

## Deployment Steps

1. **Connect Repository to Railway**
   - Go to Railway dashboard
   - Create new project
   - Connect your GitHub repository

2. **Add Environment Variables**
   - Go to project settings
   - Add all required variables listed above

3. **Configure Database**
   - Add PostgreSQL database service in Railway
   - Copy DATABASE_URL to environment variables
   - Railway will auto-inject this

4. **Deploy**
   - Railway will automatically deploy on git push
   - First deployment will run:
     - `npm ci` (install dependencies)
     - `npx prisma generate` (generate Prisma client)
     - `npm run build` (build Next.js)
     - `npm run start` (start server)

5. **Database Migration**
   - After first deploy, run migration:
   ```bash
   railway run npx prisma migrate deploy
   ```
   - Or seed database:
   ```bash
   railway run npx prisma db seed
   ```

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure all environment variables are set
- Verify DATABASE_URL is accessible

### Server Won't Start
- Check that PORT and HOSTNAME are not hardcoded
- Verify `npm run start` command works locally
- Check Railway logs for errors

### Database Connection Issues
- Ensure DATABASE_URL format is correct
- Check if Prisma schema matches database
- Run `npx prisma generate` in build phase

### Socket.IO Connection Issues
- Ensure PRODUCTION_URL is set correctly
- Check CORS settings in server.js
- Verify WebSocket connections are allowed

## Monitoring

- View logs: `railway logs`
- Check metrics in Railway dashboard
- Set up health check endpoint: `/api/health`

## Commands

```bash
# View logs
railway logs

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npx prisma db seed

# Connect to shell
railway run bash

# Link local project
railway link
```
