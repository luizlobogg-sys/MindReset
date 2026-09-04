MindReset build fix

- Removed GitHub Actions concurrency cancellation so a new push/run does not cancel an active APK build.
- npm install now runs with audit/fund/progress disabled and prefers cached packages.
- Firebase 11.10.0 is compatible with @capacitor-firebase/authentication 7.2.0.
- The workflow still generates SHA-1/SHA-256 using signingReport.
