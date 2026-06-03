# Glance Surface MVP Mocks

These mocks use the shared `glancePayload` and prioritize fishing decisions over raw data density.

## Visual Direction

- Keep MeteoCatch identity: crisp blue accent, restrained dark/light cards, fishing-window score, and explicit risk chips.
- Do not copy Tide Guide's tide-first aesthetic. MeteoCatch should lead with `Can I fish, when, and what should I watch?`
- Use compact numeric hierarchy: score/window first, supporting water/weather/moon second.

## Home Screen Widget: Small

MVP:

```text
MeteoCatch
Marseille

76
09:00-12:00

Vent 8 kt
PM 10:42
```

Behavior:

- Score color maps to `activity.tone`.
- Main line is `window.label`.
- Bottom two rows prefer wind and tide/river.
- Stale payload shows `MAJ 2h` in place of the secondary row.

Later polish:

- Tiny tide curve.
- Species icon.
- Configurable saved spot.

## Home Screen Widget: Medium

MVP:

```text
MeteoCatch                 Marseille

Best window      09:00-12:00        76
Loup actif       Marée montante

Vent 8 kt        Houle 0.5 m        Lune croissante
Risque           GO
```

Behavior:

- Left side explains the decision.
- Right score remains tappable entry point into the selected day.
- Marine row changes to river flow for freshwater.

Later polish:

- Mini line chart for tide/river trend.
- Two-day comparison.
- App intent configuration.

## Lock Screen Widget

MVP rectangular:

```text
76  09:00-12:00  Vent 8 kt  PM 10:42
```

MVP circular:

```text
76
09h
```

Behavior:

- No long spot names.
- Use `à confirmer` when source availability is partial.
- Avoid privacy-heavy details on lock screen by default.

Later polish:

- Alternate circular complication for tide/river only.
- User-controlled privacy mode hiding spot name/species.

## Live Activity

MVP Lock Screen:

```text
MeteoCatch · Marseille

Window active in 42 min          76
09:00-12:00 · Loup

Marée montante · Vent 8 kt · GO
```

MVP Dynamic Island compact:

```text
76  42m
```

Behavior:

- Starts from alert setup or best-window card.
- Updates countdown, score/tone, water state, and risk.
- Ends automatically after `window.endMinute`.
- If data becomes stale, keep countdown but show `données à confirmer`.

Later polish:

- Expanded Dynamic Island with mini tide curve.
- One-tap end activity.
- Multiple activity modes: fishing window, anchor watch, morning report.

## Apple Watch

MVP app glance:

```text
Marseille
76
09:00-12:00
Vent 8 kt
PM 10:42
```

MVP complication:

```text
76
09h
```

Behavior:

- Uses last synced phone payload.
- Manual refresh from watch app.
- Show stale state clearly; never imply live marine data when phone has not synced.

Later polish:

- Native watch chart.
- Complication families.
- Haptic alert for active window.

## MVP Priority

1. Medium Home Screen widget.
2. Small Home Screen widget.
3. Live Activity for active fishing window.
4. Lock Screen widgets.
5. Watch app glance.
6. Watch complications.

