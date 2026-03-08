

# CalmPath — Revised Plan

## Key Changes from Original Plan

Based on your sketch and feedback, three major shifts:

1. **Home screen = "Relax" tab** with your chosen animal avatar, a gamified level/XP bar, and stress-relief mini-games
2. **Animal avatar selection** added to initial setup flow
3. **Bottom tab navigation**: Relax, Trips, Map, Settings
4. **Step-by-step navigation** (one checkpoint at a time, not a timeline view)
5. **Accurate Copenhagen Airport map** (simplified but geographically faithful)

## App Structure

```text
Bottom Tabs:
┌──────────┬──────────┬──────────┬──────────┐
│  Relax   │  Trips   │   Map    │ Settings │
│ (home)   │ (journey)│ (nav)    │ (prefs)  │
└──────────┴──────────┴──────────┴──────────┘
```

## Screens

### 1. Splash Screen
- Logo, subtitle, "Start Demo" button
- "Demo for Copenhagen Airport" label

### 2. Quick Setup (2-3 steps, card-based)
- **Step 1**: Pick your avatar — grid of ~6 cute animal characters (fox, owl, panda, bunny, cat, turtle) rendered as simple illustrated SVG icons
- **Step 2**: Pick preferences (toggle cards: avoid crowds, simpler directions, extra reassurance, etc.)
- **Step 3**: "Your calm profile is ready" confirmation with chosen avatar

### 3. Relax Tab (Home — your sketch)
- Chosen animal avatar displayed prominently at top
- **Level progress bar** between Level 1 and Level 2 (gamified XP from completing journey checkpoints and mini-games)
- **Mini-Games section** — 3 cards:
  - Breathing exercise (inhale/exhale animation)
  - Color match (simple tap game)
  - Calm sounds (ambient sound player mock)
- Bottom tab bar always visible

### 4. Trips Tab
- Current trip card: "Copenhagen Airport — Gate A12"
- Journey checklist (one active step highlighted, others locked/completed)
- "Start Navigation" button takes you to Map tab with active guidance

### 5. Map Tab (Live Navigation)
- **Accurate Copenhagen Airport SVG map** — based on real terminal layout (Terminal 2/3, Pier A/B/C gates area), simplified but geographically correct
- Shows only current step: e.g., "Head to Security checkpoint"
- Pulsing dot for location, thick route line to next checkpoint only
- Action buttons: Voice, Quiet Place, Support Card
- Progress dots at top (current step highlighted)
- Gate change and stress alerts trigger as overlays during navigation

### 6. Settings Tab
- Accessibility preferences from setup (editable)
- Avatar change
- Guidance style toggles

### 7. Overlays/Modals (unchanged)
- Stress point modal (breathing prompt, quiet place option)
- Gate change notification (A12 → A18)
- Support card (full-screen staff-facing)
- Quiet place finder
- Fallback guide preview

## Copenhagen Airport Map
SVG map based on real CPH layout: main terminal building, security zone, Pier A with gates A12 and A18 marked, key landmarks (bathrooms, café, help desk, quiet area, charging point). Simplified but recognizable to anyone who's been there.

## Implementation Order
1. Design system (calming color palette, CSS variables)
2. Splash screen
3. Setup flow with animal avatar picker
4. Bottom tab layout (Relax, Trips, Map, Settings)
5. Relax/Home screen with avatar, level bar, mini-games
6. Copenhagen Airport SVG map component
7. Trips tab with step-by-step journey
8. Map tab with live navigation (one step at a time)
9. Gate change, stress alert, support card overlays
10. Fallback guide, quiet place screen

