# Running the app on a phone (Android dev build)

Expo Go can't run this app (it uses native modules — MMKV, WatermelonDB-ready storage,
notifications, location, sensors — and is on a newer SDK than store Expo Go). The app is tested on a
real device via an **EAS development build**, per the workflow decisions
(`[[project-product-decisions]]`). **Android only** for now.

## One-time setup (you, once)
1. Create a free Expo account at https://expo.dev (if you don't have one).
2. In the project folder, log in: `npx eas login` (I can't do this — it needs your credentials).

## Build (once per chunk of features — builds are slow, don't rebuild per change)
```
npx eas build --platform android --profile development
```
- Runs in Expo's cloud (~10–20 min). No Android Studio needed.
- When it finishes, EAS gives a QR/URL — open it on your phone to **install the APK**.
- This is a **development build**: after installing once, run `npx expo start --dev-client` and the
  installed app connects to the Metro dev server over Wi-Fi (or `--tunnel`), so most future changes
  are **live-reloaded without rebuilding**. Only native changes (new native module, app.json config)
  need a fresh build.

## Alternative: a standalone APK (no Metro, no live reload)
```
npx eas build --platform android --profile preview
```
Produces a self-contained APK that just runs — good for a quick look, but every change needs a rebuild.

## Profiles (`eas.json`)
- **development** — dev client + internal APK (the main testing vehicle).
- **preview** — standalone internal APK.
- **production** — Play Store app-bundle (used only when publishing the full app later).

## Notes
- `android.package` is `com.islamfinance.app` (provisional — the app name isn't final yet; change the
  package before the first Play Store submission, as it's permanent once published).
- Native permissions used: location (prayer times/qibla), notifications (reminders). Both are
  requested at the moment the user enables the feature, never at startup.
- No secrets in the app — the only server surface (gold/silver price proxy) is a separate deploy
  (`/proxy`) and isn't wired in yet.
