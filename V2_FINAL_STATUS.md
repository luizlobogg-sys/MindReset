# MindReset V2/V5 final package

Updated together:
- `www/index.html`: V2 interface/features.
- `native/MindResetUsagePlugin.java`: Android usage access/history/social metrics.
- `package.json`: Capacitor Firebase Authentication + Firebase JS SDK dependencies.
- `capacitor.config.json`: native Google provider enabled.
- GitHub Actions build workflow: native plugin registration, Usage Access permission, Firebase Android config detection, and integration checks.

## Required Firebase file

`google-services.json` cannot be generated safely from the public Firebase web configuration. Download the Android configuration for package `com.mindreset.app` from Firebase Console and put it at the project root. The GitHub Actions workflow copies it into `android/app/` when present.

The APK can still build without that file, but native Google Sign-In requires it plus the correct SHA-1/SHA-256 fingerprints and Google provider enabled in Firebase Authentication.
