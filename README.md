# MindReset

MindReset is a digital wellbeing Android app focused on healthier technology habits.

## Release features
- Portuguese, English and Spanish UI
- Digital wellbeing dashboard and score
- Android Usage Access integration for real device screen-time data
- Mood tracker stored locally
- Focus timer and session counter
- Seven-day digital reset challenges
- Local-first data handling; no account required
- Privacy policy included in `www/privacy.html`
- Automatic Android build through GitHub Actions
- Debug APK and release AAB workflows

## GitHub Actions
Every push to `main` runs the Android build. The workflow also supports manual runs.

The public release workflow builds an Android App Bundle (AAB). For a production-signed build, configure the repository secrets described in `.github/workflows/release-aab.yml`.

## Google Play target
The generated Android project is configured to target API 36, which is required for new Google Play submissions from August 31, 2026.

## Privacy
The app's privacy policy is available at `www/privacy.html`. If using GitHub Pages, publish the repository's `www` directory or copy the policy to a public website before submitting to Google Play.

## Important
Before public distribution, verify the app's Data safety declarations, permission disclosures, store listing, screenshots, support contact, privacy-policy URL and signing configuration in Play Console.
