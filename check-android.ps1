Write-Host "🔍 Checking Android Development Environment..." -ForegroundColor Yellow
Write-Host ""

# Check Java
Write-Host "Checking Java..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found. Please install JDK 11 or later" -ForegroundColor Red
}

# Check Android SDK
Write-Host "Checking Android SDK..." -ForegroundColor Cyan
if ($env:ANDROID_HOME) {
    Write-Host "✅ ANDROID_HOME is set: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "❌ ANDROID_HOME not set. Please install Android Studio" -ForegroundColor Red
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
}

# Check NPM
Write-Host "Checking NPM..." -ForegroundColor Cyan
try {
    $npmVersion = npm --version
    Write-Host "✅ NPM is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
Write-Host "If all items show ✅, you're ready to build your Android app!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run android:build" -ForegroundColor White
Write-Host "2. Run: npm run android:open" -ForegroundColor White
Write-Host "3. Create an emulator in Android Studio" -ForegroundColor White
Write-Host "4. Run: npm run android:run" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: ANDROID-BUILD-GUIDE.md" -ForegroundColor Gray
