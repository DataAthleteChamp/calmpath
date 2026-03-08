

# Plan: Disability Profile Setup + Digital Accessibility Settings

## 1. New Setup Step: "Tell us about you" (Disability Picker)

Add a new step between avatar selection (step 0) and preferences (step 1) in SetupFlow. Setup becomes 4 steps: Avatar -> Disability Profile -> Preferences -> Ready.

**Disability options** (multi-select, card-based with icon + short description):
- ADHD — "Short next-step cues, minimal distractions"
- Autism — "Predictable sequence, transition warnings"
- Dyslexia — "Icon-first, low-text mode"
- Anxiety — "Reassuring tone, fallback certainty"
- Low Vision — "Audio-first, high contrast"
- None / Prefer not to say

Selecting a disability auto-enables relevant preferences (e.g., selecting ADHD turns on conciseMode + simplerDirections).

## 2. Accessibility Settings (Functional, not just toggles)

Add a new "Digital Accessibility" section in SettingsTab AND in AppContext with real working features:

| Setting | Implementation |
|---|---|
| **Font size** (slider: Small / Medium / Large / XL) | CSS variable `--font-scale` applied to `html` element, all text scales via `rem` |
| **Dark / Light theme** | Toggle using class on `<html>`, already have `.dark` CSS vars defined |
| **High contrast mode** | Adds `.high-contrast` class — increases border weights, text contrast, removes subtle backgrounds |
| **Dyslexia-friendly font** | Loads Google Font "Andika" and applies it app-wide via body class `.dyslexia-font` |
| **Read aloud** | Uses browser `SpeechSynthesis` API to read key UI text aloud when toggled on |
| **Reduce motion** | Disables all CSS animations via `prefers-reduced-motion` override class |
| **Large tap targets** | Increases minimum button/card padding via CSS class |

## 3. Context Changes (AppContext.tsx)

Add to state:
```typescript
type DisabilityProfile = 'adhd' | 'autism' | 'dyslexia' | 'anxiety' | 'lowVision';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  darkMode: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  readAloud: boolean;
  reduceMotion: boolean;
  largeTapTargets: boolean;
}
```

## 4. Files to Change

- **AppContext.tsx** — Add `disabilityProfiles`, `accessibilitySettings` state + setters
- **SetupFlow.tsx** — Add step 1 (disability picker), shift existing steps to 2 and 3, update progress dots to 4 steps
- **SettingsTab.tsx** — Add "Digital Accessibility" section with all toggles
- **index.css** — Add `.high-contrast`, `.dyslexia-font`, `.large-targets`, `.reduce-motion` utility classes, font-size scale vars
- **App.tsx or MainApp.tsx** — Apply accessibility classes to root element based on context state
- **New utility: `useReadAloud` hook** — Wraps SpeechSynthesis API, used by navigation/map screens to speak current objective

## 5. From the Screenshot (Additional Features to Incorporate)

- **Color blindness safe**: Already using distinct shapes + text alongside colors — will verify route confidence indicators aren't color-only
- **Keyboard access**: Ensure all interactive elements are focusable (already using `<button>` elements)
- **Consistent navigation**: Bottom tab bar is already persistent
- **Image descriptions**: Add `aria-label` to all emoji/icon elements
- **Error messages**: Add clear error states for any interactions
- **Visible location**: Current location indicator on map already exists
- **Enough time**: No auto-advancing screens, user controls pace
- **Reduce blinking/movement**: Covered by reduce motion toggle

