# Deployment Guide for KhelBazaar

This guide walks you through deploying your frontend to Vercel and backend to Render.

## Prerequisites
- GitHub repository with your project pushed
- Vercel account (vercel.com)
- Render account (render.com)
- MongoDB Atlas account (for database)

## Step 1: Deploy Backend to Render

### 1.1 Prepare Environment Variables

You'll need these environment variables on Render:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `NODEMAILER_EMAIL` - Email for sending notifications
- `NODEMAILER_PASSWORD` - Email app password
- `ESEWA_MERCHANT_CODE` - eSewa merchant code
- `ESEWA_SECRET_KEY` - eSewa secret key
- `FRONTEND_URL` - Your Vercel frontend URL (set this after frontend deployment)

### 1.2 Deploy via Render Dashboard

1. Go to [render.com](https://render.com) and log in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository
5. Fill in the details:
   - **Name**: `khelbazaar-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Select your region
   - **Plan**: Free (or Starter as needed)
6. Add Environment Variables:
   - Click "Add from .env" or add them individually
   - Add all environment variables from the list above
7. Click "Create Web Service"
8. Wait for deployment to complete (~5 minutes)
9. Copy your Render backend URL (e.g., `https://khelbazaar-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Prepare Environment Variables

1. In your project, create or update `NEXT_PUBLIC_BASEURL` with your Render backend URL:
   ```
   NEXT_PUBLIC_BASEURL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

2. Push these changes to GitHub:
   ```bash
   git add .
   git commit -m "Setup deployment configuration"
   git push
   ```

### 2.2 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select your repository
5. Framework Preset: Should auto-detect "Next.js"
6. Fill in the details:
   - **Project Name**: `khelbazaar-frontend` (or your preference)
7. Add Environment Variables:
   - `NEXT_PUBLIC_BASEURL`: Your Render backend URL
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
8. Click "Deploy"
9. Wait for deployment to complete (~3-5 minutes)
10. Copy your Vercel frontend URL (e.g., `https://khelbazaar-frontend.vercel.app`)

## Step 3: Update Backend CORS Configuration

Now that you have both URLs:

1. Go back to Render Dashboard
2. Find your backend service
3. Go to "Environment" tab
4. Add/Update `FRONTEND_URL` with your Vercel URL:
   ```
   https://khelbazaar-frontend.vercel.app
   ```
5. Click "Save" - service will automatically redeploy

## Step 4: Test the Deployment

1. Visit your Vercel frontend URL
2. Test key features:
   - User authentication
   - Product browsing
   - Add to cart
   - Checkout process
   - Payment flow

## Important Notes

### MongoDB Atlas Setup
- Make sure your MongoDB Atlas connection string includes your IP address in the whitelist
- Add both your local IP and Render's IP range (or set to 0.0.0.0/0 for development)

### Cloudinary Setup
- Ensure upload presets are configured for your frontend domain
- Add your Vercel domain to Cloudinary's allowed domains if needed

### eSewa Payment Gateway
- Test mode vs Production mode URLs
- Ensure callback URLs are set correctly in eSewa dashboard

### Custom Domain (Optional)
- **For Vercel**: Add custom domain in Project Settings → Domains
- **For Render**: Add custom domain in Service Settings → Custom Domain

## Troubleshooting

### CORS Errors
- Check that `FRONTEND_URL` is set correctly on Render
- Verify the backend CORS configuration includes your frontend domain

### Database Connection Issues
- Test MongoDB Atlas connection string locally first
- Check IP whitelist in MongoDB Atlas
- Verify `MONGODB_URI` is correct

### Build Failures
- Check build logs in Render/Vercel dashboard
- Ensure all environment variables are set
- Run `npm run build` locally to test

### Payment Gateway Issues
- Verify eSewa credentials are correct
- Check callback URLs match deployment URLs
- Test with eSewa's test mode first

## Monitoring

### Render Dashboard
- View real-time logs: Service → Logs
- Monitor resource usage: Service → Monitoring
- Set up alerts: Service → Alerts

### Vercel Dashboard
- View analytics: Project → Analytics
- Check deployments: Project → Deployments
- Monitor errors: Project → Error Management

## Updates and Redeployment

### Frontend Updates
1. Make changes and push to GitHub
2. Vercel automatically redeploys
3. Monitor deployment status in dashboard

### Backend Updates
1. Make changes and push to GitHub
2. Render automatically redeploys
3. Monitor deployment status in dashboard

---

For more help, visit:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
