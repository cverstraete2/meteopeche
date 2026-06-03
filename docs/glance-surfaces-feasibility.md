# Glance Surfaces Feasibility

## Current Native Baseline

MeteoCatch is a Capacitor app with:

- iOS shell: `ios/App/App.xcodeproj`.
- Android shell: `android/app`.
- Local notifications through Capacitor.
- Web forecast, timing, planning, and alert data models.

No WidgetKit, ActivityKit, or watchOS targets exist yet.

## Required iOS Targets

Home Screen and Lock Screen widgets:

- Add a WidgetKit extension target.
- Share a small JSON payload through an App Group container.
- Render SwiftUI widget families: small, medium, rectangular lock-screen, and accessory circular.

Live Activities:

- Add ActivityKit support inside the iOS app target.
- Add Dynamic Island and Lock Screen Live Activity views.
- Start/update/end activities from native code bridged from the Capacitor web layer.
- Store only active outing state, not full forecast history.

Apple Watch:

- Add a watchOS app target with SwiftUI views.
- Add a WatchConnectivity bridge if live phone data is needed.
- MVP can render last synced glance payload from the paired iPhone.

## Build, Signing, and App Store Implications

- WidgetKit, ActivityKit, App Groups, and WatchConnectivity require Apple Developer capabilities and provisioning profile updates.
- ActivityKit requires iOS 16.1+ for Live Activities; Dynamic Island layouts require devices that support it.
- watchOS target adds separate build settings, icons, screenshots, and App Store review surface.
- Widgets cannot fetch arbitrary data frequently; they need cached timeline entries and must tolerate stale data.
- Live Activities must avoid high-frequency updates and should communicate forecast uncertainty.
- Privacy copy should mention OS surfaces that can display spot names and fishing conditions on the Lock Screen.

## Recommended MVP Sequence

1. Shared glance payload model in the web app.
2. App Group bridge from Capacitor app to iOS native storage.
3. WidgetKit extension with small and medium widgets.
4. Live Activity for an active fishing window.
5. Apple Watch companion glance after widget payload stabilizes.

## MVP Scope

Widget MVP:

- Active spot name.
- Best fishing window and score.
- Tide or river state.
- Weather risk.
- Moon phase or solunar signal.
- Last updated timestamp.

Live Activity MVP:

- Active window countdown.
- Current score/tone.
- Next tide/river/solunar event.
- Safety/risk chip.
- End action when the planned window passes.

Watch MVP:

- Current spot.
- Current tide/river state.
- Best window today.
- One risk line.
- Manual refresh from phone sync.

## Later Work

- Multiple widget configurations by saved spot.
- Lock Screen accessory variants.
- Watch complications.
- Background refresh tuning.
- Android widgets and notification ongoing status.

## Follow-Up Issues

- Add iOS App Group storage bridge for glance payloads.
- Add WidgetKit extension with small and medium widgets.
- Add Live Activity native bridge and active-window state.
- Add watchOS companion app shell and synced glance view.

