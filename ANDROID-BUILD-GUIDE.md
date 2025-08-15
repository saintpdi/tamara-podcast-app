# 📱 Android App Build Guide

## 🎉 Your React App is Ready for Android!

Your web application has been successfully converted to a native Android app using **Capacitor**.

## 📋 Prerequisites

### 1. Install Android Studio
- Download from: https://developer.android.com/studio
- During installation, make sure to install:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)

### 2. Set Environment Variables
Add these to your system environment variables:
```bash
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
```

Add to PATH:
```bash
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 3. Install Java JDK
- Download JDK 11 or later
- Set JAVA_HOME environment variable

## 🚀 Building Your Android App

### Quick Start Commands

#### 1. Build for Production
```powershell
npm run android:build
```

#### 2. Run on Device/Emulator
```powershell
npm run android:run
```

#### 3. Open in Android Studio
```powershell
npm run android:open
```

#### 4. Development with Live Reload
```powershell
npm run android:dev
```

## 📱 Testing Your App

### Using Android Emulator
1. Open Android Studio
2. Go to Tools → AVD Manager
3. Create a new virtual device
4. Run the emulator
5. Use `npm run android:run`

### Using Physical Device
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect via USB
4. Use `npm run android:run`

## 🔧 Build Configurations

### Debug Build (for testing)
```powershell
npm run build
npx cap sync android
npx cap run android
```

### Release Build (for Play Store)
```powershell
npm run build
npx cap sync android
npx cap build android --prod
```

## 📦 Generating APK/AAB

### Debug APK
1. Open Android Studio
2. Open project: `android/` folder
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. APK location: `android/app/build/outputs/apk/debug/`

### Release APK/AAB
1. Generate signing key:
```bash
keytool -genkey -v -keystore tamara-release-key.keystore -alias tamara-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/tamara-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'tamara-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. Build release:
```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB for Play Store
```

## 🎨 Customizing Your App

### App Icon
- Replace icons in: `android/app/src/main/res/mipmap-*/`
- Use sizes: 48x48, 72x72, 96x96, 144x144, 192x192
- Or use online generator: https://icon.kitchen/

### Splash Screen
- Edit: `android/app/src/main/res/drawable/splash.xml`
- Configure in: `capacitor.config.ts`

### App Name & Package
- Edit `android/app/src/main/AndroidManifest.xml`
- Edit `capacitor.config.ts`

### Permissions
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />
```

## 📊 Mobile Features Added

Your app now includes:
- ✅ Native splash screen
- ✅ Status bar styling
- ✅ Haptic feedback
- ✅ Keyboard handling
- ✅ Network status detection
- ✅ Mobile-optimized UI
- ✅ Safe area handling (notches)

## 🔍 Troubleshooting

### Common Issues

#### 1. "SDK not found"
- Install Android Studio
- Set ANDROID_HOME environment variable
- Restart terminal/VS Code

#### 2. "Gradle build failed"
- Open project in Android Studio
- Let it download dependencies
- Try building from Android Studio first

#### 3. "Device not detected"
- Enable USB Debugging on device
- Install device drivers
- Check `adb devices` command

#### 4. "App crashes on startup"
- Check device logs: `adb logcat`
- Verify environment variables are set
- Test on emulator first

#### 5. "White screen on mobile"
- Check if Supabase environment variables are set
- Test web version first
- Check mobile console logs

### Getting Logs
```bash
# Android device logs
adb logcat

# Capacitor specific logs
adb logcat | grep -i capacitor

# App specific logs
adb logcat | grep -i com.tamara.podcast
```

## 🚀 Publishing to Google Play Store

### 1. Prepare Release Build
```bash
npm run build
npx cap sync android
```

### 2. Generate Signed Bundle
```bash
cd android
./gradlew bundleRelease
```

### 3. Upload to Play Console
- Go to: https://play.google.com/console
- Create new app
- Upload AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
- Fill app details, screenshots, etc.
- Submit for review

## 📈 Performance Tips

1. **Optimize Bundle Size**
   - Use dynamic imports
   - Remove unused dependencies
   - Enable tree shaking

2. **Improve Loading**
   - Implement service worker
   - Use skeleton screens
   - Optimize images

3. **Native Performance**
   - Use Capacitor plugins for heavy operations
   - Minimize DOM updates
   - Use virtual scrolling for long lists

## 🆘 Need Help?

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Developer**: https://developer.android.com
- **Stack Overflow**: Tag with `capacitor` and `android`

---

## 📱 Quick Reference

| Command | Description |
|---------|-------------|
| `npm run android:build` | Build production Android app |
| `npm run android:run` | Run on device/emulator |
| `npm run android:dev` | Development with live reload |
| `npm run android:open` | Open in Android Studio |
| `npm run android:sync` | Sync web assets to Android |

Your Android app is ready! 🎉
