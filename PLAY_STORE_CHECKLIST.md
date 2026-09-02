# MindReset — Google Play release checklist

## Required before submission
- Create the app in Google Play Console.
- Use the application ID `com.mindreset.app` consistently.
- Build a signed Android App Bundle (`.aab`).
- Enroll in Google Play App Signing when Play Console offers it.
- Complete the store listing, category, support email and screenshots.
- Provide the public URL of `privacy.html` as the privacy-policy URL.
- Complete the Data safety form accurately.
- Declare the Android Usage Access permission and explain why it is used.
- Complete the content rating questionnaire.
- Complete target audience and child-safety declarations accurately.
- Upload the release AAB to an internal/closed test first.
- Test installation, Usage Access, language switching, data deletion and offline behavior.
- Fix any Play Console pre-launch or policy warnings before production release.

## Signing secrets used by GitHub Actions
Create these repository secrets:

- `MINDRESET_KEYSTORE_B64` — base64 of the upload keystore file.
- `MINDRESET_KEYSTORE_PASSWORD` — keystore password.
- `MINDRESET_KEY_ALIAS` — upload key alias.
- `MINDRESET_KEY_PASSWORD` — upload key password.

Never commit the keystore, passwords or signing files to the repository.

## Release
Push a tag such as `v1.0.0` or manually run `Release MindReset AAB` from GitHub Actions. The resulting artifact is `MindReset-Release-AAB`.
