# Pro Entitlement Architecture

## Source of Truth

MVP source of truth:

- Native StoreKit / Play Billing receipt status on device.
- Local cached entitlement state in `settings.entitlements`.
- Optional server verification later for cross-device sync and support tooling.

Production target:

- Native purchase layer validates products.
- App writes normalized entitlement state into the web layer.
- Server verification becomes the durable source when account sync exists.

## Web State Contract

The web app uses:

- `state.entitlements`
- `hasEntitlement("pro")`
- `canUseFeature(feature)`
- `FEATURE_ENTITLEMENTS`

Current default:

```json
{
  "tier": "free",
  "source": "local",
  "expiresAt": null,
  "checkedAt": null,
  "features": {}
}
```

The local default never grants Pro.

## Feature Mapping

Pro-gated MVP features:

- `planning.10day`
- `planning.monthly`
- `alerts.windDrop`
- `alerts.speciesActivity`
- `alerts.multiSpot`
- `glance.widgets`
- `glance.liveActivity`
- `glance.watch`
- `journal.analytics`
- `trip.export`

Safety-critical current condition warnings must not require Pro.

## Native Behavior

iOS:

- StoreKit 2 loads products.
- Purchase and restore update `settings.entitlements`.
- Widget/Live Activity bridge should read entitlements only for display/gating, not for safety warnings.

Android:

- Play Billing mirrors the same normalized contract.
- Android widgets later use the same feature ids.

Web/PWA:

- No native purchase flow in MVP.
- Paywall can preview Pro but purchase CTA should show unavailable/configuration state unless web billing is added.

## Test and Fallback States

Supported sources:

- `local`: default Free cache.
- `test`: internal manual/test override only in development builds.
- `storekit`: validated iOS purchase.
- `play-billing`: validated Android purchase.
- `server`: verified account entitlement.

Fallback behavior:

- If entitlement check fails, keep last known non-expired Pro state only until `expiresAt`.
- If expired or missing, fall back to Free.
- Never hide current safety data because entitlement lookup failed.

## Implementation Tasks

- Add StoreKit product ids and native purchase bridge.
- Add Play Billing product ids and native purchase bridge.
- Add restore purchase bridge.
- Add entitlement refresh at app launch/resume.
- Add paywall unavailable states for web/PWA.
- Add optional server verification endpoint.
- Add QA fixtures for Free, Pro active, Pro expired, restore success, restore empty, and billing unavailable.

