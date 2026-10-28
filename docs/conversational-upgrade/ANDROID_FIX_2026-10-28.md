# Android preview 1.1.1

The reported screenshot combines a hosting problem and an Android layout problem.

- The preview service has no deployed version. Its source is staged in private-test, so Railway returns its generic Not Found page. Activation was attempted during this fix request but canceled because deployment approval was not granted. No deployment has occurred.
- The original toolbar used a 48-pixel height instead of density-independent sizing. Combined with Android's target-35 edge-to-edge behavior, its text was clipped into the top edge.

## Changes

- Use a 56-dp toolbar, legible button labels and density-aware padding.
- Handle system-bar, display-cutout and keyboard insets explicitly on modern Android.
- Show the app's own status screen for a failed main-frame HTTP request, with Retry. Do not tell users to alter phone network settings for a preview service that has not started.
- Retain TLS verification, the trusted origin, storage keys, package ID and signing certificate.
- Increment the APK to 1.1.1-preview / version code 20261029 so it can update the installed preview without uninstalling it.

The APK compiles and its signature/package metadata verify. The toolbar and native error screen have not been visually tested on a real device here. Backend activation and live AI checks remain pending explicit deployment approval.

Android reference: https://developer.android.com/develop/ui/views/layout/edge-to-edge
