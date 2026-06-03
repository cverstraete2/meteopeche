# Pro Paywall Flow

## Entry Points

Use contextual entry points rather than a generic upsell:

- Tapping monthly or seasonal planning beyond the free horizon.
- Enabling Pro-only alert types such as wind drop or species activity.
- Trying to configure multiple alert spots.
- Opening widget/watch setup before native entitlement exists.
- Exporting a trip shortlist or advanced journal analytics.

## Screen Structure

The first screen should show the product, not a price table.

1. Header: `MeteoCatch Pro`
2. Subhead: `Plan the right window before you pack.`
3. Preview carousel:
   - 10-day planning comparison.
   - Smart alert set.
   - Widget/Live Activity glance.
4. Feature comparison:
   - Free: current conditions, basic window, safety/risk, one spot.
   - Pro: long-range planning, advanced alerts, multi-spot, widgets/watch.
5. Plan selector:
   - Yearly with trial, primary.
   - Monthly, secondary.
   - Lifetime only if business chooses to support it.
6. CTA: `Start free trial` or `Continue with Pro`.
7. Secondary actions:
   - Restore purchase.
   - Family Sharing note placeholder.
   - Close.

## Visual Preview Content

10-day planning preview:

```text
Best upcoming days
Thu 76  09:00-12:00  GO
Fri 68  07:00-10:00  Watch wind
Sat 52  18:00-21:00  Cycle only
```

Smart alerts preview:

```text
Alert set · Marseille
Rising tide        60 min before
Wind drop          Pro
Morning report     07:00
Quiet hours        21:00-07:00
```

Widget preview:

```text
MeteoCatch
76 · 09:00-12:00
Vent 8 kt · PM 10:42
```

## Copy Rules

Use:

- `Forecast confidence is shown when long-range data is cycle-based.`
- `Safety-critical current conditions stay available without Pro.`
- `Advanced planning and automations are included in Pro.`

Avoid:

- `Guaranteed best fishing days.`
- `Perfect monthly forecast.`
- `Never miss fish.`

## Restore and Family Sharing

Restore copy:

`Already subscribed? Restore purchase.`

Family Sharing placeholder:

`Family Sharing availability depends on App Store configuration.`

Restore states:

- Loading: `Checking purchases...`
- Success: `Pro restored.`
- Empty: `No active purchase found.`
- Error: `Restore unavailable. Try again later.`

## Close and Continue

Every paywall must include:

- Close button in the top-right corner.
- Continue without Pro link when the user entered from a non-blocking preview.
- Clear disabled or unavailable state when native purchase APIs are not configured.

## MVP vs Later

MVP:

- Static preview carousel.
- Monthly/yearly placeholders.
- Restore placeholder.
- Close/continue path.
- Entitlement-aware feature gate messages.

Later:

- StoreKit product loading.
- Trial eligibility messaging.
- Family Sharing status.
- Promotional offers.
- Personalized preview using the active spot.

