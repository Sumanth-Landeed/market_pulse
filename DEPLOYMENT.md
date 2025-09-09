# Market Pulse - Deployment Guide

This guide will help you deploy your Market Pulse application using Vercel (frontend) + Railway (backend) + MongoDB Atlas (database).

## Prerequisites

1. GitHub account
2. Vercel account (free)
3. Railway account (free tier available)
4. MongoDB Atlas account (free tier available)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (choose the free M0 tier)
4. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose "Password" authentication
   - Create a strong password
5. Whitelist your IP address:
   - Go to Network Access
   - Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for simplicity
6. Get your connection string:
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (replace <password> with your actual password)

## Step 2: Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Create a new project
4. Connect your GitHub repository
5. Select the root directory (where hello_world.py is located)
6. Railway will automatically detect it's a Python app
7. Set environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `MONGO_DB_NAME`: Your database name (e.g., "market_pulse_db")
8. Deploy! Railway will give you a URL like `https://your-app-name.railway.app`

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Set the following:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Set environment variables:
   - `VITE_API_URL`: Your Railway backend URL (e.g., `https://your-app-name.railway.app`)
6. Deploy!

## Step 4: Update Vercel Configuration

After getting your Railway backend URL, update the `vercel.json` file in the frontend directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-RAILWAY-URL.railway.app/$1"
    }
  ]
}
```

## Step 5: Import Your Data

You'll need to import your existing MongoDB data to MongoDB Atlas:

1. Export your local MongoDB data:
   ```bash
   mongodump --db mydatabase --out ./backup
   ```

2. Import to MongoDB Atlas:
   ```bash
   mongorestore --uri="your-mongodb-atlas-connection-string" ./backup/mydatabase
   ```

## Environment Variables Summary

### Backend (Railway)
- `MONGO_URI`: MongoDB Atlas connection string
- `MONGO_DB_NAME`: Database name

### Frontend (Vercel)
- `VITE_API_URL`: Railway backend URL

## Custom Domain (Optional)

Both Vercel and Railway support custom domains:
- Vercel: Add domain in project settings
- Railway: Add domain in project settings

## Monitoring

- Railway: Built-in metrics and logs
- Vercel: Built-in analytics and performance monitoring
- MongoDB Atlas: Built-in monitoring and alerts

## Troubleshooting

1. **CORS Issues**: The backend includes CORS middleware, but you can restrict origins in production
2. **Environment Variables**: Make sure all environment variables are set correctly
3. **Database Connection**: Verify your MongoDB Atlas connection string and network access
4. **Build Issues**: Check the build logs in both Vercel and Railway

## Cost

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Railway**: $5 credit monthly (usually enough for small apps)
- **MongoDB Atlas**: Free tier includes 512MB storage

Total cost: **$0** (within free tier limits)
