# 🚀 Deployment Guide - Tamara Platform

## Overview
This guide covers multiple deployment options for the Tamara video/podcast platform, from beginner-friendly to advanced setups.

---

## 🌟 **RECOMMENDED: Vercel (Easiest)**

### **Why Vercel?**
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Built-in environment variable management
- ✅ Global CDN
- ✅ Perfect for React/Vite projects

### **Deployment Steps:**

#### **1. Prepare Your Project**
```bash
# Ensure your project builds successfully
npm run build

# Create production environment file
cp .env .env.production
```

#### **2. Deploy via Vercel CLI (Recommended)**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "c:\Users\ITORO IHKPESSII\Desktop\tamara"
vercel

# Follow the prompts:
# ? Set up and deploy "tamara"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? tamara-platform
# ? In which directory is your code located? ./
```

#### **3. Configure Environment Variables**
```bash
# Add environment variables via CLI
vercel env add VITE_SUPABASE_URL
# Paste: https://xokezxcubfffhwxmceby.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Or via Vercel Dashboard:
# 1. Go to https://vercel.com/dashboard
# 2. Select your project
# 3. Go to Settings > Environment Variables
# 4. Add the variables
```

#### **4. Deploy via Vercel Dashboard (Alternative)**
1. Go to https://vercel.com
2. Sign up/login with GitHub, GitLab, or Bitbucket
3. Click "New Project"
4. Import your Git repository
5. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

---

## 🐙 **GitHub Pages (Free)**

### **Setup Steps:**

#### **1. Prepare for GitHub Pages**
```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

#### **2. Update Vite Config for GitHub Pages**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/tamara/', // Replace with your repo name
  // ... rest of config
});
```

#### **3. Deploy**
```bash
# Build and deploy
npm run deploy
```

#### **4. Configure GitHub Pages**
1. Go to your GitHub repository
2. Settings > Pages
3. Source: Deploy from a branch
4. Branch: gh-pages
5. Your site will be available at: `https://yourusername.github.io/tamara/`

---

## 🌐 **Netlify (Easy)**

### **Deployment Options:**

#### **Option A: Drag & Drop**
1. Run `npm run build`
2. Go to https://netlify.com
3. Drag the `dist` folder to the deploy area
4. Configure environment variables in Site Settings

#### **Option B: Git Integration**
1. Connect your Git repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Site Settings > Environment Variables

---

## ☁️ **AWS S3 + CloudFront (Advanced)**

### **Setup Steps:**

#### **1. Build the Project**
```bash
npm run build
```

#### **2. Create S3 Bucket**
```bash
# Install AWS CLI
# Configure AWS credentials
aws configure

# Create bucket
aws s3 mb s3://tamara-platform-bucket

# Enable static website hosting
aws s3 website s3://tamara-platform-bucket --index-document index.html --error-document index.html
```

#### **3. Upload Files**
```bash
# Sync build files to S3
aws s3 sync dist/ s3://tamara-platform-bucket --delete
```

#### **4. Set up CloudFront**
1. Go to AWS CloudFront console
2. Create a new distribution
3. Origin Domain: your S3 bucket
4. Configure custom error pages for SPA routing

---

## 🔥 **Firebase Hosting (Google)**

### **Setup Steps:**

#### **1. Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

#### **2. Initialize Firebase**
```bash
firebase init hosting
# Select your project or create new one
# Public directory: dist
# Single-page app: Yes
# Set up automatic builds: No (for now)
```

#### **3. Deploy**
```bash
npm run build
firebase deploy
```

---

## 🚢 **Docker + Any Cloud (Advanced)**

### **Dockerfile**
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **nginx.conf**
```nginx
events {}
http {
    include /etc/nginx/mime.types;
    
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### **Deploy**
```bash
# Build Docker image
docker build -t tamara-platform .

# Run locally
docker run -p 8080:80 tamara-platform

# Deploy to cloud provider (AWS ECS, Google Cloud Run, etc.)
```

---

## 📱 **Environment Variables for Production**

### **Required Environment Variables:**
```env
VITE_SUPABASE_URL=https://xokezxcubfffhwxmceby.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

### **Platform-Specific Setup:**

#### **Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### **Netlify:**
- Site Settings > Environment Variables
- Add each variable

#### **GitHub Pages:**
- Repository Settings > Secrets and Variables > Actions
- Add repository secrets

---

## 🔧 **Pre-Deployment Checklist**

### **1. Code Quality**
- ✅ All TypeScript errors resolved
- ✅ Build completes successfully
- ✅ Environment variables configured
- ✅ No console errors in production

### **2. Performance**
- ✅ Images optimized
- ✅ Bundle size under 1MB (current: 889KB)
- ✅ Enable gzip compression
- ✅ Configure caching headers

### **3. Security**
- ✅ Environment variables not in code
- ✅ HTTPS enabled
- ✅ CORS properly configured
- ✅ CSP headers set

### **4. SEO & Meta**
- ✅ Update title and meta tags
- ✅ Add favicon
- ✅ Configure social media previews

---

## 🎯 **QUICK START: Deploy in 5 Minutes**

### **Fastest Method (Vercel):**
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel` (from project directory)
4. Add environment variables via dashboard
5. Done! ✨

### **Your live URL will be:**
`https://tamara-platform-xyz.vercel.app`

---

## 📞 **Need Help?**

### **Common Issues:**
1. **White screen on deployed site**: Check environment variables
2. **404 on refresh**: Configure SPA routing
3. **Build fails**: Check TypeScript errors
4. **Slow loading**: Enable compression and CDN

### **Debugging:**
```bash
# Check build locally
npm run build
npx serve dist

# Check environment variables
echo $VITE_SUPABASE_URL
```

---

## 🌟 **RECOMMENDATION**

**For beginners**: Use **Vercel** - it's the easiest and most reliable.
**For advanced users**: Use **AWS S3 + CloudFront** for full control.
**For free hosting**: Use **Netlify** or **GitHub Pages**.

Choose the platform that best fits your needs and technical comfort level!
