# 🚀 Tamara Platform Deployment Script (Windows PowerShell)
# Usage: .\deploy.ps1 [platform]
# Platforms: vercel, netlify, firebase, gh-pages

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("vercel", "netlify", "firebase", "gh-pages")]
    [string]$Platform = "vercel"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment for Tamara Platform..." -ForegroundColor Blue
Write-Host "📋 Deployment platform: $Platform" -ForegroundColor Cyan

# Pre-deployment checks
Write-Host "🔍 Running pre-deployment checks..." -ForegroundColor Yellow

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update .env with your actual values before deploying!" -ForegroundColor Yellow
}

# Run build to ensure it works
Write-Host "🔨 Building the application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Platform-specific deployment
switch ($Platform) {
    "vercel" {
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
        
        # Check if Vercel CLI is installed
        try {
            vercel --version | Out-Null
        } catch {
            Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        Write-Host "🔑 Please ensure you're logged in to Vercel (vercel login)" -ForegroundColor Cyan
        Write-Host "🔧 Make sure to set environment variables in Vercel dashboard" -ForegroundColor Cyan
        
        vercel --prod
        Write-Host "🎉 Deployed to Vercel!" -ForegroundColor Green
    }
    
    "netlify" {
        Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Blue
        
        # Check if Netlify CLI is installed
        try {
            netlify --version | Out-Null
        } catch {
            Write-Host "⚠️  Netlify CLI not found. Installing..." -ForegroundColor Yellow
            npm install -g netlify-cli
        }
        
        Write-Host "🔑 Please ensure you're logged in to Netlify (netlify login)" -ForegroundColor Cyan
        netlify deploy --prod --dir=dist
        Write-Host "🎉 Deployed to Netlify!" -ForegroundColor Green
    }
    
    "firebase" {
        Write-Host "🚀 Deploying to Firebase..." -ForegroundColor Blue
        
        # Check if Firebase CLI is installed
        try {
            firebase --version | Out-Null
        } catch {
            Write-Host "⚠️  Firebase CLI not found. Installing..." -ForegroundColor Yellow
            npm install -g firebase-tools
        }
        
        Write-Host "🔑 Please ensure you're logged in to Firebase (firebase login)" -ForegroundColor Cyan
        firebase deploy
        Write-Host "🎉 Deployed to Firebase!" -ForegroundColor Green
    }
    
    "gh-pages" {
        Write-Host "🚀 Deploying to GitHub Pages..." -ForegroundColor Blue
        
        # Check if gh-pages is installed
        try {
            npm list gh-pages | Out-Null
        } catch {
            Write-Host "⚠️  gh-pages not found. Installing..." -ForegroundColor Yellow
            npm install --save-dev gh-pages
        }
        
        npm run deploy:gh-pages
        Write-Host "🎉 Deployed to GitHub Pages!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🌟 Deployment completed successfully! 🌟" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Don't forget to:" -ForegroundColor Cyan
Write-Host "   1. Set up environment variables on your hosting platform" -ForegroundColor White
Write-Host "   2. Configure your custom domain (if needed)" -ForegroundColor White
Write-Host "   3. Set up monitoring and analytics" -ForegroundColor White
Write-Host "   4. Test your deployed application" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your Tamara Platform is now live! 🎉" -ForegroundColor Green
