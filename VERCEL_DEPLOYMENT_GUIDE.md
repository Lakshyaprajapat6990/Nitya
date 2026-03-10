# Vercel Deployment Guide for DevYogam

This guide covers deploying both the Backend (BE) and Client projects to Vercel.

---

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Push your code to GitHub
3. **MongoDB Atlas Database** - Get your connection string
4. **Node.js** installed locally (v18+)

---

## Part 1: Backend Deployment (DevYogam_BE-main)

### Step 1: Environment Variables (CRITICAL!)

⚠️ **IMPORTANT**: Use these EXACT variable names in Vercel Dashboard:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (NOT MONGODB_URI!) |
| `JWT_SECRET` | Your secure JWT secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Email for nodemailer |
| `EMAIL_PASS` | Email app password |
| `IMGBB_API_KEY` | imgBB API key |

### Step 2: Deploy to Vercel

**Via Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository (DevYogam_BE-main)
4. Configure:
   - Framework Preset: `Other`
   - Build Command: Leave empty
   - Output Directory: Leave empty
5. **Add ALL environment variables** (especially MONGO_URI!)
6. Click "Deploy"

### Step 3: MongoDB Atlas Network Access (CRITICAL!)

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click Confirm

---

## Part 2: Client Deployment (DevYogam_Client-master)

### Environment Variables

Add in Vercel:
```
REACT_APP_API_BASE_URL=https://your-backend-project.vercel.app
```

**IMPORTANT**: Replace `your-backend-project` with your actual backend project name from Step 1!

### Deploy

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import DevYogam_Client-master
4. Configure:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add: `REACT_APP_API_BASE_URL` = `https://your-backend-xxx.vercel.app`
6. Deploy

---

## Part 3: Verify Deployment

### Test Backend
```
bash
curl https://your-backend.vercel.app/
# Should return: "API is running..."

curl https://your-backend.vercel.app/api/poojas
# Should return JSON array
```

---

## Common Issues & Fixes

### ❌ 500 Error - "MONGO_URI not defined"
- **Fix**: Add `MONGO_URI` (not MONGODB_URI) in Vercel environment variables

### ❌ 500 Error - API endpoints fail
- **Fix**: Check MongoDB Atlas Network Access = 0.0.0.0/0

### ❌ CORS Errors
- **Fix**: CORS is configured with origin: true - should work

### ❌ Client shows empty data
- **Fix**: Check REACT_APP_API_BASE_URL is correct in client settings

---

## Quick Checklist

- [ ] Backend deployed to Vercel
- [ ] MONGO_URI environment variable added
- [ ] MongoDB Atlas network access = 0.0.0.0/0
- [ ] Backend URL works (returns "API is running...")
- [ ] Client deployed to Vercel
- [ ] REACT_APP_API_BASE_URL set correctly
- [ ] Client works at your-client.vercel.app
