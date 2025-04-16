# Railway Deployment Guide

This guide will help you deploy your Next.js application on Railway.

## Prerequisites

- A Railway account (sign up at [railway.app](https://railway.app))
- Your GitHub repository connected to Railway

## Deployment Steps

### 1. Create a New Project

1. Log in to your Railway account
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Add a PostgreSQL Database

1. In your project, click "New"
2. Select "Database" > "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database

### 3. Configure Environment Variables

1. In your project settings, go to the "Variables" tab
2. Add the following environment variables:
   ```
   DATABASE_URL=<Railway will provide this automatically>
   GEMINI_API_KEY=your_existing_key
   JWT_SECRET=your_existing_key
   RESEND_API_KEY=your_existing_key
   NODE_ENV=production
   ```

### 4. Deploy Your Application

1. Railway will automatically detect your Next.js application
2. It will use the build and start commands from your package.json
3. The deployment will start automatically

### 5. Run Database Migrations

After deployment, you need to run the database migrations:

1. Go to your project in Railway
2. Click on the "Deployments" tab
3. Find your latest deployment
4. Click on the three dots menu and select "Open Shell"
5. Run the following commands:
   ```bash
   npm run migrate:postgres
   npm run seed:postgres
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs for errors
   - Ensure all dependencies are properly listed in package.json

2. **Database Connection Issues**
   - Verify that the DATABASE_URL environment variable is set correctly
   - Check that the PostgreSQL service is running

3. **Application Crashes**
   - Check the application logs for errors
   - Verify that all required environment variables are set

### Getting Help

If you encounter issues not covered in this guide, you can:
- Check the [Railway documentation](https://docs.railway.app/)
- Join the [Railway Discord community](https://discord.com/invite/railway)
- Contact Railway support through their website 