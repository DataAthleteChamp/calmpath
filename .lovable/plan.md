

# Redesigned Airport Map

## What Changes

### 1. Bigger, clearer SVG map (`CphAirportMap.tsx`) — full rewrite
- **Larger viewBox** (400x600) with bigger buildings, wider walkways, and larger labels/icons
- **User's avatar emoji** displayed at current position instead of just a blue dot (with pulsing ring behind it)
- **Destination pulsing green circle** on the active target checkpoint
- **Thicker route line** (6px) with clear dashed active segment
- **Larger location icons** — rounded rect badges with emoji + label (not tiny dots)
- **Recognizable landmarks**: 7-Eleven, McDonald's (MC), Starbucks near relevant areas — matching the sketch
- **"Busy area" badge** near check-in/MC area as shown in sketch
- **Simplified layout** matching sketch: entrance at bottom, straight walkway up to check-in, WC to the side, security band, then piers above
- **Remove Pier B and C** clutter — only show Pier A since that's where the journey goes
- Keep quiet zone, help desk, charging point as emoji markers

### 2. Real-world photo hints on MapTab
- Add a small photo preview card below the current objective showing a stock description of what to look for (text-based mock, e.g., "Look for the blue Check-in counters on your right")
- This is a text hint, not actual photos (hackathon demo)

### 3. MapTab layout tweaks
- Give the map container more vertical space (`min-h-[55vh]`)
- Ensure map fills available space properly

## Files to Change
- **`src/components/CphAirportMap.tsx`** — Full rewrite with new layout
- **`src/pages/MapTab.tsx`** — Add visual hint text, adjust map container sizing

