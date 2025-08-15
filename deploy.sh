#!/bin/bash

# 🚀 Tamara Platform Deployment Script
# Usage: ./deploy.sh [platform]
# Platforms: vercel, netlify, firebase, gh-pages

set -e  # Exit on any error

echo "🚀 Starting deployment for Tamara Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if platform is provided
PLATFORM=${1:-"vercel"}

print_status "Deployment platform: $PLATFORM"

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from example..."
    cp .env.example .env
    print_warning "Please update .env with your actual values before deploying!"
fi

# Run build to ensure it works
print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed! Please fix errors before deploying."
    exit 1
fi

# Platform-specific deployment
case $PLATFORM in
    "vercel")
        print_status "Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        print_status "Please ensure you're logged in to Vercel (vercel login)"
        print_status "Make sure to set environment variables in Vercel dashboard"
        
        vercel --prod
        print_success "Deployed to Vercel! 🎉"
        ;;
        
    "netlify")
        print_status "Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            print_warning "Netlify CLI not found. Installing..."
            npm install -g netlify-cli
        fi
        
        print_status "Please ensure you're logged in to Netlify (netlify login)"
        netlify deploy --prod --dir=dist
        print_success "Deployed to Netlify! 🎉"
        ;;
        
    "firebase")
        print_status "Deploying to Firebase..."
        if ! command -v firebase &> /dev/null; then
            print_warning "Firebase CLI not found. Installing..."
            npm install -g firebase-tools
        fi
        
        print_status "Please ensure you're logged in to Firebase (firebase login)"
        firebase deploy
        print_success "Deployed to Firebase! 🎉"
        ;;
        
    "gh-pages")
        print_status "Deploying to GitHub Pages..."
        if ! npm list gh-pages &> /dev/null; then
            print_warning "gh-pages not found. Installing..."
            npm install --save-dev gh-pages
        fi
        
        npm run deploy:gh-pages
        print_success "Deployed to GitHub Pages! 🎉"
        ;;
        
    *)
        print_error "Unknown platform: $PLATFORM"
        print_status "Available platforms: vercel, netlify, firebase, gh-pages"
        exit 1
        ;;
esac

print_success "🎉 Deployment completed successfully!"
print_status "Don't forget to:"
print_status "1. Set up environment variables on your hosting platform"
print_status "2. Configure your custom domain (if needed)"
print_status "3. Set up monitoring and analytics"
print_status "4. Test your deployed application"

echo ""
print_success "🌟 Your Tamara Platform is now live! 🌟"
