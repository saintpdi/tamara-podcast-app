# Android Development Environment Check
# Run this script to verify your system is ready for Android development

Write-Host "🔍 Checking Android Development Environment..." -ForegroundColor Yellow
Write-Host ""

$allGood = $true

# Check Java
Write-Host "Checking Java..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1
    if ($javaVersion -match "version") {
        Write-Host "✅ Java is installed: $($javaVersion[0])" -ForegroundColor Green
    } else {
        Write-Host "❌ Java not found. Please install JDK 11 or later" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "❌ Java not found. Please install JDK 11 or later" -ForegroundColor Red
    $allGood = $false
}

# Check Android SDK
Write-Host "Checking Android SDK..." -ForegroundColor Cyan
$androidHome = $env:ANDROID_HOME
if ($androidHome -and (Test-Path $androidHome)) {
    Write-Host "✅ ANDROID_HOME is set: $androidHome" -ForegroundColor Green
    
    # Check for platform-tools
    $platformTools = Join-Path $androidHome "platform-tools"
    if (Test-Path $platformTools) {
        Write-Host "✅ Platform tools found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Platform tools not found. Install from Android Studio SDK Manager" -ForegroundColor Yellow
    }
    
    # Check ADB
    try {
        $adbVersion = adb version 2>&1
        if ($adbVersion -match "Android Debug Bridge") {
            Write-Host "✅ ADB is working" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  ADB not in PATH. Add platform-tools to PATH" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ ANDROID_HOME not set or invalid. Please install Android Studio and set ANDROID_HOME" -ForegroundColor Red
    $allGood = $false
}

# Check Android Studio
Write-Host "Checking Android Studio..." -ForegroundColor Cyan
$studioPaths = @(
    "${env:ProgramFiles}\Android\Android Studio\bin\studio64.exe",
    "${env:LOCALAPPDATA}\JetBrains\Toolbox\apps\AndroidStudio\ch-0\*\bin\studio64.exe"
)

$studioFound = $false
foreach ($path in $studioPaths) {
    if (Test-Path $path) {
        Write-Host "✅ Android Studio found at: $path" -ForegroundColor Green
        $studioFound = $true
        break
    }
}

if (-not $studioFound) {
    Write-Host "⚠️  Android Studio not found in common locations" -ForegroundColor Yellow
    Write-Host "   Please install from: https://developer.android.com/studio" -ForegroundColor Gray
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    $allGood = $false
}

# Check NPM
Write-Host "Checking NPM..." -ForegroundColor Cyan
try {
    $npmVersion = npm --version
    Write-Host "✅ NPM is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM not found" -ForegroundColor Red
    $allGood = $false
}

# Check Capacitor CLI
Write-Host "Checking Capacitor CLI..." -ForegroundColor Cyan
try {
    $capVersion = npx @capacitor/cli --version 2>&1
    if ($capVersion -match "@capacitor/cli") {
        Write-Host "✅ Capacitor CLI is available" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Capacitor CLI not found globally, but npx will work" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Capacitor CLI check failed, but npx should work" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📱 Checking connected devices..." -ForegroundColor Cyan
try {
    $devices = adb devices
    $deviceLines = $devices -split "`n" | Where-Object { $_ -match "\tdevice$" }
    if ($deviceLines.Count -gt 0) {
        Write-Host "✅ Found $($deviceLines.Count) connected device(s):" -ForegroundColor Green
        foreach ($device in $deviceLines) {
            Write-Host "   $device" -ForegroundColor Gray
        }
    } else {
        Write-Host "ℹ️  No devices connected. You can use an emulator or connect a device later" -ForegroundColor Blue
    }
} catch {
    Write-Host "ℹ️  Could not check devices (ADB not available)" -ForegroundColor Blue
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow
if ($allGood) {
    Write-Host "🎉 Your system is ready for Android development!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: npm run android:build" -ForegroundColor White
    Write-Host "2. Run: npm run android:open" -ForegroundColor White
    Write-Host "3. In Android Studio, create an emulator or connect a device" -ForegroundColor White
    Write-Host "4. Run: npm run android:run" -ForegroundColor White
} else {
    Write-Host "⚠️  Please resolve the issues above before building your Android app" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation links:" -ForegroundColor Cyan
    Write-Host "- Java JDK: https://adoptopenjdk.net/" -ForegroundColor White
    Write-Host "- Android Studio: https://developer.android.com/studio" -ForegroundColor White
    Write-Host "- Node.js: https://nodejs.org/" -ForegroundColor White
}

Write-Host ""
Write-Host "For detailed instructions, see: ANDROID-BUILD-GUIDE.md" -ForegroundColor Gray
