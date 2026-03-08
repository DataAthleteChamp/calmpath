

# Redesigned Airport Map — Clean, MazeMap-inspired Indoor Navigation

## Problem
Current map has overlapping labels, cramped layout, too many visual elements competing for attention, and an overall cluttered feel. It doesn't look polished enough for a demo.

## Design Direction
Inspired by **MazeMap** and clean indoor wayfinding apps:
- **Soft floor plan** — light gray rounded shapes for buildings, no heavy borders
- **Wide corridors** as visible walkways (light beige/cream fill between buildings)
- **Minimal labels** — only checkpoint destinations + 2-3 recognizable landmarks
- **Floating pill badges** — clean rounded pills with emoji + label, well-spaced
- **Smooth curved route** using SVG `<path>` with bezier curves instead of jagged polylines
- **Large avatar** with soft blue glow, clearly visible
- **Destination marker** with gentle pulsing green glow
- **Muted landmarks** — smaller, faded, non-competing with main checkpoints
- **No busy area badge or calm route badge** — reduce clutter, keep only essential info
- **Wider viewBox** (420x650) with more padding and breathing room

## Layout (top to bottom)

```text
┌──────────────────────────────┐
│         PIER A               │
│   ┌─A18─┐    ┌─A12─┐        │
│   └─────┘    └─────┘        │
│        │                     │
│   ☕ Starbucks   🤫 Quiet    │
│        │                     │
│   ☕ Café/Snack              │
│════════SECURITY══════════════│
│                              │
│  🚻 WC     ┌─Check-in─┐     │
│             └──────────┘     │
│   🍔 McDonald's  🏪 7-11    │
│                              │
│        ┌─ENTRANCE─┐         │
│        └──────────┘         │
└──────────────────────────────┘
```

## Key Visual Changes

| Before | After |
|---|---|
| Sharp polyline routes | Smooth curved SVG paths with rounded joins |
| Tight spacing, overlaps | 30%+ more spacing between all elements |
| Small 9-12px labels | 13-14px checkpoint labels, 10px landmarks |
| Heavy building outlines | Subtle fills, no strokes on buildings |
| 7 locations + 6 landmarks = 13 items | 7 locations + 3 landmarks = 10 items |
| Busy area / calm route badges | Removed — less clutter |
| Emoji + text crammed in small rects | Wider pills with proper padding |

## Files to Change

- **`src/components/CphAirportMap.tsx`** — Full rewrite with new clean layout
- **`src/pages/MapTab.tsx`** — No changes needed (already good)

## Technical Approach

- Use SVG `<path>` with quadratic bezier curves for smooth route lines
- Softer color palette: building fills `hsl(220 15% 93%)`, walkways `hsl(40 20% 96%)`
- Reduce landmarks to just McDonald's, Starbucks, Quiet Zone (3 total)
- Larger checkpoint pills: 90x36px with proper emoji-label spacing
- Avatar circle: r=20 with soft shadow filter
- Destination: gentle pulse animation on outer ring only

