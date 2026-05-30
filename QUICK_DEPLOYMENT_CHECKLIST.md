# KhelBazaar Deployment Checklist

## What I've Prepared ✅

Your project is now configured and ready to deploy. Here's what has been set up:

### Configuration Files Created:
- ✅ `frontend/vercel.json` - Vercel build configuration
- ✅ `backend/render.yaml` - Render deployment configuration  
- ✅ `backend/.env.example` - Backend environment variables template
- ✅ `frontend/.env.example` - Frontend environment variables template
- ✅ `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- ✅ Backend CORS configured to accept dynamic frontend URLs
- ✅ Git repository initialized with all files committed

---

## Quick Deployment Steps

### 1️⃣ Backend Deployment (Render)

**Time: ~5 minutes**

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (FinalYearProject)
4. Configure:
   - **Name**: `khelbazaar-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Oregon (or your preferred region)
   - **Plan**: Free

5. Add these Environment Variables:
   ```
   MONGODB_URI = [Your MongoDB Atlas connection string]
   JWT_SECRET = [Generate a random string]
   CLOUDINARY_CLOUD_NAME = [Your Cloudinary cloud name]
   CLOUDINARY_API_KEY = [Your Cloudinary API key]
   CLOUDINARY_API_SECRET = [Your Cloudinary API secret]
   NODEMAILER_EMAIL = [Your email]
   NODEMAILER_PASSWORD = [Your email app password]
   ESEWA_MERCHANT_CODE = [Your eSewa merchant code]
   ESEWA_SECRET_KEY = [Your eSewa secret key]
   ```

6. Click "Create Web Service"
7. Wait for deployment (3-5 minutes)
8. **Copy your backend URL** (e.g., `https://khelbazaar-backend.onrender.com`)

### 2️⃣ Frontend Deployment (Vercel)

**Time: ~5 minutes**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Project Name**: `khelbazaar-frontend`
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./frontend`

5. Add these Environment Variables:
   ```
   NEXT_PUBLIC_BASEURL = [Your Render backend URL from Step 1]
   NEXT_PUBLIC_GOOGLE_CLIENT_ID = [Your Google OAuth Client ID]
   ```

6. Click "Deploy"
7. Wait for deployment (3-5 minutes)
8. **Copy your frontend URL** (e.g., `https://khelbazaar-frontend.vercel.app`)

### 3️⃣ Update Backend CORS

**Time: ~2 minutes**

1. Go back to Render Dashboard
2. Find `khelbazaar-backend` service
3. Go to "Environment" tab
4. Add/Update:
   ```
   FRONTEND_URL = [Your Vercel frontend URL from Step 2]
   ```
5. Click "Save" - service will redeploy automatically

---

## Required Credentials & Services

You'll need these before deploying:

### Essential:
- ✅ GitHub account (with FinalYearProject pushed)
- ✅ Vercel account
- ✅ Render account
- ✅ MongoDB Atlas account + connection string
- ✅ Google OAuth credentials (Client ID)

### Optional but Recommended:
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)
- eSewa merchant account (for payments)
- Nodemailer app password

---

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/khelbazaar
FRONTEND_URL=https://your-frontend.vercel.app
JWT_SECRET=your_random_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your_app_specific_password
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=your_secret_key
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BASEURL=https://your-backend.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## Testing After Deployment

### Frontend Tests:
- [ ] Visit your Vercel URL
- [ ] Sign up / Login works
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout process
- [ ] Payment integration

### Backend Tests:
- [ ] API health check (GET `/`)
- [ ] Database connection working
- [ ] Image uploads to Cloudinary
- [ ] Email notifications sending
- [ ] Payment gateway responding

---

## Important Notes

### CORS Issues?
- Ensure `FRONTEND_URL` is set on Render
- Backend CORS now dynamically accepts your frontend URL

### Database Connection Failed?
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Test connection locally first

### Payment Not Working?
- Check eSewa credentials are correct
- Verify callback URLs match deployment URLs
- Use eSewa test mode first

### Image Upload Not Working?
- Ensure Cloudinary credentials are correct
- Check Cloudinary upload presets
- Verify CORS headers from backend

---

## Monitoring & Maintenance

### View Logs:
- **Render Backend**: Service → Logs (real-time)
- **Vercel Frontend**: Project → Deployments → Logs

### Monitor Performance:
- **Render**: Service → Monitoring (CPU, memory, disk)
- **Vercel**: Project → Analytics (requests, page performance)

### Automatic Redeploys:
- Frontend redeploys on every GitHub push to main
- Backend redeploys on every GitHub push to main

---

## Next Steps

1. **Push to GitHub** (already done - repository initialized)
2. **Deploy Backend** (Follow Step 1 above)
3. **Deploy Frontend** (Follow Step 2 above)
4. **Update CORS** (Follow Step 3 above)
5. **Test Everything** (Use the checklist above)
6. **Monitor Logs** (Watch for any errors)

---

## Support & Documentation

- 📖 [Vercel Docs](https://vercel.com/docs)
- 📖 [Render Docs](https://render.com/docs)
- 📖 [MongoDB Docs](https://docs.mongodb.com)
- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📖 [Express Docs](https://expressjs.com)

---

**Your project is ready! Follow the deployment steps above and you'll be live in ~15 minutes.** 🚀
