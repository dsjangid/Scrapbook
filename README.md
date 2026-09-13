# 📱 Our Scrapbook — Native Mobile App (Android & iOS)

> **Dedicated Birthday Edition for Kartik**  
> Package Name: `com.kanika.kartikscrapbook`  
> App Name: **Our Scrapbook**  
> Native Framework: **Capacitor 6**

---

## 📂 Project Architecture

```
kartik-scrapbook-app/
├── android/                 # Native Android Studio Project (Gradle)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── assets/public/   # All 31 offline photos, audio, & video bundled inside app
│   │   └── res/mipmap-*/    # Custom romantic launcher icons (Heart & Kraft theme)
├── ios/                     # Native iOS Xcode Project
│   └── App/
│       └── App.xcodeproj    # Ready to open in Xcode
├── www/                     # Web app source code & assets
├── capacitor.config.json    # Mobile app configuration
└── .github/workflows/       # Automated Cloud APK Builder (build-apk.yml)
```

---

## 🤖 1. How to Build & Install on Android (.apk)

### Option A: 1-Click with Android Studio (Easiest & Instant)
1. Open **Android Studio**.
2. Click **Open** and select the folder `/Users/meydivyansh/Desktop/Bday/kartik-scrapbook-app/android`.
3. In the top menu, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Once completed, click **locate** to get the generated `app-debug.apk` file.
5. Send this `.apk` to Kartik via WhatsApp, Telegram, or Google Drive.
6. When he taps the `.apk` on his Android phone, it installs directly as an app named **"Our Scrapbook"** on his home screen!

---

### Option B: Automated Cloud Build via GitHub
1. Push this folder to a GitHub repository.
2. Go to the **Actions** tab on GitHub.
3. The workflow `Build Android APK` will automatically run and compile the APK in ~2 minutes.
4. Download the `Kartik-Scrapbook-App.zip` artifact containing the ready-to-install `.apk`!

---

## 🍏 2. How to Build & Install on iPhone (iOS)

### Option A: Automated Cloud Build via GitHub (Easiest)
1. Push your changes to GitHub (branch `mobile-app` or `main`).
2. Go to the **Actions** tab on GitHub (`dsjangid/Scrapbook`).
3. The **"Build iOS App (IPA)"** workflow will automatically compile the iOS app in the cloud using macOS runners.
4. Download the **`Kartik-Scrapbook-iOS`** artifact which contains `Kartik-Scrapbook-iOS.ipa`.
5. Install the `.ipa` onto any iPhone using:
   - **[Sideloadly](https://sideloadly.io/)** (Free Mac/Windows app — plug in iPhone and drag-and-drop the `.ipa`)
   - **AltStore** / **Scarlet** / **TrollStore** / **GBox**
   - Or direct Xcode Devices installation (`Window > Devices and Simulators > Installed Apps`).

---

### Option B: Local Run via Xcode
1. Open **Xcode** on your Mac.
2. Select **Open a Project or File** and choose `/Users/meydivyansh/Desktop/Bday/kartik-scrapbook-app/ios/App/App.xcodeproj`.
3. Connect Kartik's (or your) iPhone via USB cable to the Mac.
4. Select the connected iPhone in Xcode's target device bar.
5. Click the **Play / Run (▶)** button.
6. The app will install directly onto the iPhone's home screen with the romantic heart icon!

---

## ✨ Native App Highlights
- 📦 **100% Offline Support:** All photos, music tracks, voice notes, and short film are bundled directly into the app bundle.
- 🎨 **Custom App Icon:** High-resolution launcher icons across all standard Android & iOS densities.
- 🎵 **Native Media Playback:** Hardware-accelerated audio/video playback and continuous soundtrack.

