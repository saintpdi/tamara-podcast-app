#!/bin/bash

# APK Builder Script for Tamara Podcast App
# This script builds the Android APK in a Docker container with proper Java version

echo "🚀 Building APK for Tamara Podcast App..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    echo "Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Build the React app first
echo "📦 Building React app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ React build failed!"
    exit 1
fi

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed!"
    exit 1
fi

# Create Dockerfile for Android build
cat > Dockerfile.android << 'EOF'
FROM openjdk:17-jdk-slim

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Download and install Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip -q commandlinetools-linux-8512546_latest.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
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
EOF

# Build APK using Docker
echo "🔨 Building APK in Docker container..."
docker build -f Dockerfile.android -t tamara-android-builder .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Extract APK from container
echo "📱 Extracting APK..."
docker run --rm -v $(pwd):/output tamara-android-builder sh -c "cp /output/tamara-podcast.apk /output/"

if [ -f "tamara-podcast.apk" ]; then
    echo "🎉 APK built successfully!"
    echo "📍 Location: $(pwd)/tamara-podcast.apk"
    echo "📏 Size: $(du -h tamara-podcast.apk | cut -f1)"
    echo ""
    echo "🚀 You can now install this APK on your Android device!"
    echo "   1. Enable 'Unknown Sources' in Android Settings"
    echo "   2. Transfer the APK to your device"
    echo "   3. Install by tapping the APK file"
else
    echo "❌ APK build failed!"
    exit 1
fi

# Cleanup
rm -f Dockerfile.android

echo "✅ Build completed!"
