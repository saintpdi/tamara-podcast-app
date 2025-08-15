# APK Builder Script for Tamara Podcast App (PowerShell)
# This script builds the Android APK using Docker with proper Java version

Write-Host "🚀 Building APK for Tamara Podcast App..." -ForegroundColor Yellow

# Check if Docker is available
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Gray
    exit 1
}

# Build the React app first
Write-Host "📦 Building React app..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ React build failed!" -ForegroundColor Red
    exit 1
}

# Sync with Capacitor
Write-Host "🔄 Syncing with Capacitor..." -ForegroundColor Cyan
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Capacitor sync failed!" -ForegroundColor Red
    exit 1
}

# Create Dockerfile for Android build
$dockerfileContent = @"
FROM openjdk:17-jdk-slim

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=`${PATH}:`${ANDROID_HOME}/cmdline-tools/latest/bin:`${ANDROID_HOME}/platform-tools

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Download and install Android SDK
RUN mkdir -p `${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip -q commandlinetools-linux-8512546_latest.zip -d `${ANDROID_HOME}/cmdline-tools && \
    mv `${ANDROID_HOME}/cmdline-tools/cmdline-tools `${ANDROID_HOME}/cmdline-tools/latest && \
    rm commandlinetools-linux-8512546_latest.zip

# Accept licenses and install required packages
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

WORKDIR /app
COPY android/ /app/

# Build the APK
RUN ./gradlew assembleDebug

# Copy APK to output
RUN mkdir -p /output && \
    cp app/build/outputs/apk/debug/app-debug.apk /output/tamara-podcast.apk

CMD ["echo", "APK built successfully!"]
"@

Set-Content -Path "Dockerfile.android" -Value $dockerfileContent

# Build APK using Docker
Write-Host "🔨 Building APK in Docker container..." -ForegroundColor Cyan
docker build -f Dockerfile.android -t tamara-android-builder .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Extract APK from container
Write-Host "📱 Extracting APK..." -ForegroundColor Cyan
docker create --name temp-container tamara-android-builder
docker cp temp-container:/output/tamara-podcast.apk ./tamara-podcast.apk
docker rm temp-container

if (Test-Path "tamara-podcast.apk") {
    $apkSize = (Get-Item "tamara-podcast.apk").Length / 1MB
    Write-Host "🎉 APK built successfully!" -ForegroundColor Green
    Write-Host "📍 Location: $(Get-Location)\tamara-podcast.apk" -ForegroundColor White
    Write-Host "📏 Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 You can now install this APK on your Android device!" -ForegroundColor Yellow
    Write-Host "   1. Enable 'Unknown Sources' in Android Settings" -ForegroundColor Gray
    Write-Host "   2. Transfer the APK to your device" -ForegroundColor Gray
    Write-Host "   3. Install by tapping the APK file" -ForegroundColor Gray
} else {
    Write-Host "❌ APK build failed!" -ForegroundColor Red
    exit 1
}

# Cleanup
Remove-Item "Dockerfile.android" -ErrorAction SilentlyContinue

Write-Host "✅ Build completed!" -ForegroundColor Green
