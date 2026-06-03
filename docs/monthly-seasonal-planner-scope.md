# Monthly and Seasonal Planner Scope

## Product Goal

Give anglers a longer-range planning surface for choosing promising fishing dates beyond the 10-day forecast. The planner should combine reliable astronomical and tidal cycles with clear forecast availability boundaries, so users understand which signals are firm and which will update closer to the trip.

## MVP Shape

The first version should be a monthly calendar for one selected spot and species.

Each day cell should show:

- Best predicted fishing window label and score band.
- Tide coefficient or tide-range proxy where available.
- High and low tide count, with first daylight high/low highlighted.
- Moon phase and major solunar window.
- Sunrise and sunset.
- Forecast confidence state: observed forecast, cycle-only estimate, or unavailable.
- Pro badge when the range exceeds the free forecast window.

The day detail sheet should show:

- Full tide events for the selected day.
- Solunar major and minor windows.
- Sunrise, sunset, dawn, dusk, and moon phase.
- Historic or model-based confidence note.
- CTA to create an alert for that date once smart alerts are available.

## Data Requirements

Required:

- Spot latitude, longitude, timezone, and water mode.
- Astronomical calculations for sun, moon phase, moonrise or moonset where feasible.
- Tide source capable of projecting beyond the 10-day weather forecast for supported marine locations.
- Current 10-day planning summary model for near-term rows.

Nice to have:

- Tide station metadata and distance to selected spot.
- Seasonal species patterns by region.
- Historic weather normals for wind, rain, and sea temperature.
- Local regulation or closure overlays where data is available.

## Limitations and Fallbacks

- Open-Meteo weather and marine forecasts should be treated as near-term planning only. Monthly cells beyond the forecast horizon must not imply live weather precision.
- Sea-level forecast availability may vary by location. If tide data is missing, show cycle-only planning with a clear `marée à confirmer` state.
- Freshwater monthly planning cannot use tides. It should rely on moon, daylight, seasonal species heuristics, and later river normals if available.
- Long-range scores should be visually distinct from 10-day forecast scores because they are lower confidence.
- The calendar should avoid minute-level precision when only cycle estimates are available.

## Free vs Pro

Free:

- Today plus the existing free forecast range.
- Basic moon phase and sunrise/sunset for the current month.
- One saved monthly planning spot.

Pro:

- Full monthly and seasonal planner.
- Yearly tide tables where a supported tide source exists.
- Multiple saved planning spots.
- Export/share trip shortlist.
- Long-range alert creation.
- Apple Watch, widgets, and Live Activity planning surfaces when those platforms are implemented.

## UX Notes

- Calendar cells should be compact and comparative, not chart-heavy.
- Use a three-state confidence indicator: `Prévision`, `Cycle`, `Indisponible`.
- Keep the best-days scan primary; full tide tables belong in the detail sheet.
- Selecting a day inside the monthly planner should reuse the 10-day planning detail components when the date is inside the forecast horizon.
- Avoid forcing users into paywall loops when a spot lacks long-range tide support.

## Follow-Up Issues

Create these when Sprint 3 is accepted:

- Research long-range tide data providers and licensing for yearly tables.
- Build monthly planner data adapter with confidence states.
- Design monthly calendar and day detail sheet.
- Add Pro-gated saved planning spots.
- Add trip shortlist and share/export prototype.

