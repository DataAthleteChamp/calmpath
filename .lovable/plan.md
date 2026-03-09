

# Fix MapTab to fit single screen without scrolling

## Problem
The map view has `min-h-[55vh]` on the map container, which combined with the top objective bar, progress dots, action buttons, and bottom button, pushes content beyond the viewport requiring scrolling.

## Solution
- Change the map container from `min-h-[55vh]` to just `flex-1` with `overflow-hidden` so it fills remaining space
- Make the outer container use `h-full overflow-hidden` to prevent any scrolling
- Compact the bottom actions: reduce padding, make the button smaller (`py-4` instead of `py-6`)
- Compact the action button row: reduce padding from `p-2.5` to `p-2`

## File: `src/pages/MapTab.tsx`
- Line 161: Change `min-h-[55vh]` → remove min-height, keep `flex-1 relative overflow-hidden`
- Line 208: Reduce bottom padding `py-3` → `py-2`, `space-y-2.5` → `space-y-2`
- Line 239: Button `py-6` → `py-4`
- Line 145: Progress dots `py-2.5` → `py-1.5`

