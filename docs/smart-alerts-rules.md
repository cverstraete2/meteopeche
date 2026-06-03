# Smart Fishing Alerts Rules

## Goal

Smart alerts should help anglers notice useful timing changes without becoming a noisy weather feed. Defaults are opt-in, capped, and quiet by design.

## Alert Catalog

| Alert | Trigger intent | Default | Pro | Safety wording |
| --- | --- | --- | --- | --- |
| Rising tide | Notify before an exploitable rising tide window. | Off, 60 min lead | No | Verify access, coefficients, weather, and local safety before launch. |
| Best solunar window | Notify before the strongest combined solunar, light, and condition window. | Off, 45 min lead | No | Solunar is a decision aid, not a catch guarantee. |
| Wind drop | Notify when wind drops below an exploitable threshold. | Off, 30 min lead | Yes | Check gusts, swell, and safety advisories even when mean wind improves. |
| Species activity | Notify when the selected species activity score becomes high. | Off, 45 min lead | Yes | Match gear, area, and regulations to the species. |
| Morning report | Send a daily summary with best window, weather, and risks. | Off, 07:00 | No | Report does not replace official weather bulletins or local rules. |

## Quiet Defaults

- All smart alerts are disabled until the user explicitly opts in.
- Quiet hours default to `21:00` through `07:00`.
- Maximum default volume is two smart alerts per day per spot.
- Morning report is one notification at a user-selected time, default `07:00`.
- Alert copy must include uncertainty when source data is partial or forecast-derived.

## Forecast Uncertainty

Alert scheduling should always carry a confidence state:

- `forecast`: weather, tide/river, and solunar data are available for the target time.
- `cycle`: astronomical or tide-cycle data is available, but weather is outside the forecast horizon.
- `partial`: one or more required marine, river, or tide signals are missing.
- `unavailable`: alert cannot be scheduled for the selected spot/time.

User-facing copy should prefer `à confirmer` wording for partial data and avoid precise promises beyond the active forecast window.

## Free vs Pro

Free should include:

- Rising tide alert for one active spot.
- Best solunar window alert for one active spot.
- Morning report for one active spot.

Pro should include:

- Wind drop condition alerts.
- High species activity alerts.
- Multiple saved alert spots.
- Long-range monthly or seasonal alert creation.
- Alert bundles for widgets, Live Activities, and Apple Watch when those surfaces exist.

## Engineering Contract

The code-level catalog lives in `SMART_ALERT_CATALOG` and normalized settings live under `settings.smartAlerts`.

Scheduler and UI work should use:

- `SMART_ALERT_TYPES` for ordering.
- `SMART_ALERT_CATALOG[type]` for labels, copy, Pro gating, and safety notes.
- `state.smartAlerts.alerts[type]` for user preferences.
- `state.smartAlerts.quietHours` and `state.smartAlerts.maxPerDay` before scheduling.

