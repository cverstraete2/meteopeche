# MeteoCatch Timing Experience Foundation

Linear scope: LIN-70, LIN-76, LIN-77.

## Product Intent

MeteoCatch should make timing feel like an angler decision, not a collection of separate charts. The first shippable experience should answer three questions:

- When is the next useful fishing window for this spot and species?
- Why is that window promising or risky?
- What should the angler watch before committing?

The product distinction from a tide-only app is that MeteoCatch combines tide, solar and lunar cycles, solunar windows, species preference, weather, marine force, river flow, and rigging context around the active fishing spot.

## Information Architecture

Recommendation: evolve the current Weather subview into a first-class planning surface named `Cycles` in the product language, while keeping the bottom navigation unchanged for the first sprint.

Rationale:

- The current mobile tab bar is already full with `Carte`, `Prévision`, `Activité`, `Journal`, and `Plus`.
- Tide and astro panels already live under the forecast workflow, so the first implementation can avoid navigation churn.
- The long-term product model can still promote `Cycles` into a dedicated tab if analytics show repeated use.

Short-term navigation:

- `Prévision` remains the main forecast entry point.
- Replace the current `Soleil / marées` weather subtab label with `Cycles` once the new timing card exists.
- `Cycles` contains the best-window card, 24h scrubber, tide state, sun/moon state, solunar windows, and key risk signals.
- `Activité` remains species-centric and uses the same selected time and best-window model.

Long-term navigation option:

- If `Cycles` becomes a top-three destination, promote it to the tab bar and move `Journal` or `Plus` behind a compact menu.
- The promoted `Cycles` tab should lead with the best-window card, not with raw tide tables.

## Mobile Behavior

The timing interaction should be built around one shared 24h time control.

- Changing the selected time updates the best-window card, tide chart marker, astro chart marker, activity score, and force metrics.
- Current time and selected time should be visually distinct.
- The selected time should persist while switching between `Prévision`, `Cycles`, and `Activité`.
- Day changes should keep the closest meaningful time if the previous selected minute is no longer available.
- The first screen should show a useful summary without requiring horizontal exploration.

The primary mobile hierarchy for `Cycles` should be:

1. Best next window card.
2. Shared 24h scrubber.
3. Tide or freshwater timing state.
4. Sun, moon, and solunar summary.
5. Detailed charts and event lists.

## Sea And Freshwater States

Sea mode:

- Show tide height, trend, next high/low, marnage, current, wave, wind, sun/moon, and solunar windows.
- Treat unavailable tide data as a degraded forecast state, not a mode failure.
- Use tide trend and marnage as important but not exclusive scoring inputs.

Freshwater mode:

- Do not show a dead-end tide unavailable panel as the primary cycle state.
- Replace tide prominence with river flow trend, pressure trend, rainfall/turbidity signal, light windows, moon phase, and solunar windows.
- Keep the same best-window language so sea and freshwater users learn one mental model.

Mixed or uncertain water mode:

- Prefer the active water mode chosen by the user.
- Add a small source/confidence detail when spot resolution is uncertain.

## Existing Data Flow Audit

Current reusable surfaces:

- `renderDayTimeline(day)` controls the selected day minute and already exposes a 15-minute timeline.
- `renderTides(day)` draws the tide chart, summary cards, focused tide row, trend, and next tide event.
- `tideRows(day)`, `tideExtrema(rows)`, `focusedTimeRow(rows)`, `tideTrendLabel(rows, focusRow)`, and `nextTideEvent(rows, extrema, focusRow)` are reusable for the best-window card.
- `renderAstro(day)`, `buildAstroData(day)`, `renderAstroSummary(astro)`, and `renderSolunarWindows(astro)` provide the solar, lunar, and solunar foundation.
- `solunarWindows(day)` provides major and minor windows used by the activity score.
- `renderActivity(day)`, `fishActivityForHour(row, fish, windows)`, and `renderActivityReasons(row, fish)` already produce species-aware activity scoring and reasons.
- `preferenceFocusChip(day, priority)` already expects `day.bestWindow`, which is a useful seam for the upcoming unified best-window model.
- Native notification helpers already exist for permission checks and scheduling, which can later support timing alerts.

Current data sources:

- Weather rows include air temperature, wind, gusts, pressure, cloud cover, precipitation, sunrise, and sunset.
- Marine rows include wave, swell, surface current, sea surface temperature, and sea level when available.
- Depth current may be enriched through Copernicus and otherwise falls back to availability messaging.
- Freshwater river forecast comes from GloFAS/Open-Meteo Flood through the backend.
- Moon phase and solunar windows are currently estimated locally.

## Reusable Timing Model

Sprint 2 should introduce a pure model function rather than more panel-specific logic:

```js
bestFishingWindowForDay(day, options)
```

Suggested input:

- `day`
- `waterMode`
- `selectedSpecies`
- `targetDepth`
- `selectedMinute`
- `profile`

Suggested output:

- `score`
- `tone`
- `label`
- `startMinute`
- `endMinute`
- `peakMinute`
- `reasons`
- `risks`
- `sourceAvailability`

This model should power:

- Best next window card.
- 10-day planning summaries.
- Smart alerts.
- Widget and watch payloads.
- Preference summary chips.

## Risks And Data Gaps

- Tide events are inferred from sea-level forecast rows, not station-certified tide tables.
- Moonrise and moonset are estimated from solunar windows, not astronomical ephemerides.
- Open-Meteo Marine availability varies by location and forecast horizon.
- Copernicus depth-current enrichment can be unavailable or delayed.
- Freshwater timing should not pretend to have tide equivalents; it needs river-specific signals.
- Paywall strategy must not hide safety-critical current conditions, warnings, or basic weather context.
- Long-range and yearly tide planning may require a different data provider if Open-Meteo horizon or precision is insufficient.

## Refactor Recommendations

Before building the card UI:

- Extract tide helpers into a timing/model section or module-like block inside `app.js`.
- Create one shared best-window model that is independent of DOM rendering.
- Normalize availability metadata so UI can explain missing tide, marine, or river data.
- Make `day.bestWindow` derive from the new model rather than independent forecast logic.
- Keep drawing functions (`drawTideChart`, `drawAstroChart`) rendering-only.

## Free And Pro Boundary Draft

Free:

- Current spot conditions.
- Current day best fishing window.
- Tide/current state where available.
- Basic sun, moon, and solunar summary.
- Safety and weather risk messaging.

Pro candidates:

- 10-day and monthly planning.
- Advanced timing alerts.
- Widgets, Live Activities, and Apple Watch surfaces.
- Multi-spot comparison.
- Journal analytics against timing, tide, moon, and weather.

## First Shippable Definition

Sprint 2 should be considered successful when:

- A user can open `Prévision > Cycles` and immediately see the next best fishing window.
- The card explains the window with no more than four high-signal reasons.
- Sea and freshwater both return useful states.
- Existing tide, astro, and activity panels remain reachable and consistent with the selected time.
