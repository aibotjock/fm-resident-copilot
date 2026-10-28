# Android microphone capture fix

The user reported `Could not start audio source` after the preview service was
successfully deployed. The native host declared RECORD_AUDIO and correctly
handled trusted-origin WebView microphone requests, but omitted
MODIFY_AUDIO_SETTINGS, which Android's WebRTC audio stack needs for audio mode
and routing. Add this normal permission without a maxSdkVersion restriction.
The runtime RECORD_AUDIO permission and trusted HTTPS origin checks remain.
Declare microphone hardware optional so typed study use remains available.

Release: 1.1.2-preview, versionCode 20261030. This is a native APK update; it
does not require a new Railway deployment. Use the same package and signing
identity so installing over the existing app preserves local progress and login.

Verification: compile and verify the signed APK, inspect packaged permissions,
version and signer identity. Real device microphone capture has not been
verified in this environment. Install the update, allow microphone use while
using the app, then start a conversation. Android's global microphone privacy
switch and another active microphone session can independently prevent capture.

Sources:
- Android permission reference: https://developer.android.com/reference/android/Manifest.permission#MODIFY_AUDIO_SETTINGS
- Expo upstream report and fix: https://github.com/expo/expo/issues/35345

Rollback: rebuild the preceding commit with a higher versionCode using the same
signing identity; do not uninstall or clear storage to downgrade.
