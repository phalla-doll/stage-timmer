# Vercel Deployment Guide

This guide explains how to deploy the Stage Timer application to Vercel with proper Convex integration.

## Pre-Deployment Steps

### 1. Get Your Convex Deployment Details

1. Go to [Convex Dashboard](https://dashboard.convex.dev/)
2. Select your project
3. Navigate to **Settings** → **Deployment Info**
4. Copy the following values:
   - **Deployment URL** (e.g., `https://your-project.convex.cloud`)
   - **Deployment ID** (e.g., `your-project`)

### 2. Create a Production Deployment Key

1. In Convex Dashboard, navigate to **Settings** → **Deployment Keys**
2. Click **Create Deployment Key**
3. Select **Production** (NOT Preview)
4. Name it (e.g., "Vercel Production")
5. Copy the generated key (starts with `convex_`)

**⚠️ IMPORTANT**: Always use Production deployment keys for production Vercel deployments. Preview keys will not work correctly in production builds.

### 3. Deploy Your Convex Backend

Before deploying to Vercel, ensure your Convex backend is deployed:

```bash
npx convex deploy
```

This will deploy your schema and functions to Convex.

## Vercel Configuration

### Option 1: Automatic Configuration (Recommended)

The `vercel.json` file in this repository provides automatic configuration. When you import your project into Vercel:

1. Vercel will automatically use the build command from `vercel.json`:
   ```
   npx convex deploy --cmd 'npm run build'
   ```

2. This command will:
   - Deploy your Convex backend
   - Build your Next.js application
   - Ensure Convex generated files are up to date

### Option 2: Manual Configuration

If you need manual control over the build process:

In Vercel Project Settings → Build & Development:

- **Build Command**: `npx convex deploy --cmd 'npm run build'`
- **Install Command**: `npm install`
- **Output Directory**: `.next`
- **Framework Preset**: Next.js

## Environment Variables

Set these environment variables in Vercel Project Settings → Environment Variables:

### Production Variables

| Variable Name | Value | Type |
|--------------|-------|------|
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL (e.g., `https://your-project.convex.cloud`) | Public |
| `CONVEX_DEPLOYMENT` | Your Convex deployment ID (e.g., `your-project`) | Private |
| `CONVEX_DEPLOY_KEY` | Your Production deployment key | Private |

### Preview/Development Variables

For preview deployments, you can use the same values as production, or create separate Convex deployments for each environment.

## Deployment Steps

### First-Time Deployment

1. **Push your code to Git** (GitHub, GitLab, or Bitbucket)
2. **Import your project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New Project**
   - Import your Git repository
3. **Configure environment variables** (see above)
4. **Deploy**:
   - Click **Deploy**
   - Vercel will run the build command from `vercel.json`
   - Wait for the build to complete
5. **Visit your site**:
   - Vercel will provide a production URL
   - Test that the application works correctly

### Subsequent Deployments

1. Push your changes to Git
2. Vercel will automatically trigger a new deployment
3. Wait for the build to complete
4. Test the changes

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'get')"

**Cause**: Convex generated files are missing or outdated.

**Solution**:
1. Ensure `NEXT_PUBLIC_CONVEX_URL` is set correctly in Vercel
2. Ensure `CONVEX_DEPLOY_KEY` is a Production deployment key
3. Redeploy your application

### Error: "NEXT_PUBLIC_CONVEX_URL is not configured"

**Cause**: The Convex URL environment variable is not set.

**Solution**:
1. Go to Vercel Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_CONVEX_URL` with your Convex deployment URL
3. Redeploy your application

### Build Fails: "convex deploy failed"

**Cause**: Convex deployment key is invalid or expired.

**Solution**:
1. Verify the deployment key is a Production key (not Preview)
2. Regenerate the key if necessary
3. Update the `CONVEX_DEPLOY_KEY` in Vercel
4. Redeploy

### 500 Internal Server Error

**Cause**: Convex client initialization failed or Convex backend is unreachable.

**Solution**:
1. Check Vercel function logs for detailed error messages
2. Verify your Convex backend is deployed and accessible
3. Ensure all environment variables are set correctly
4. Test your Convex deployment locally:
   ```bash
   npx convex dev
   ```

## Local Development

To run the application locally:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Convex credentials in `.env.local`

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Your app will be available at `http://localhost:3000`

## Monitoring

After deployment:

1. **Check Vercel Logs**: Monitor function logs for errors
2. **Check Convex Dashboard**: Monitor queries, mutations, and data
3. **Test Critical Flows**:
   - Create a new room
   - Join an existing room
   - Start/stop the timer
   - Send signals

## Summary of Changes

The following improvements have been made to fix production errors:

1. **Removed prebuild script**: Changed from `prebuild` hook to Vercel Build Command approach
2. **Added `vercel.json`**: Provides explicit build configuration for Vercel
3. **Added error boundaries**: `app/error.tsx` catches and displays errors gracefully
4. **Added loading states**: `app/loading.tsx` shows loading indicator
5. **Improved ConvexClientProvider**: Validates environment variables at startup
6. **Added error handling**: Wrapped Convex operations in try-catch blocks
7. **Updated `.env.example`**: Clarified the need for Production deployment keys

## Support

If you encounter any issues:

1. Check the [Convex documentation](https://docs.convex.dev/)
2. Check the [Vercel documentation](https://vercel.com/docs)
3. Review the troubleshooting section above
4. Check function logs in both Vercel and Convex dashboards
