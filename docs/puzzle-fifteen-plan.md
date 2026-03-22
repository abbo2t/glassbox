# Puzzle 15 — Screenshot

## Blackbox Reference
> "Take a screenshot." — Puzzle 15 (Lavender box)

The player solves this puzzle by taking a screenshot of the device while the puzzle screen is active.

## Expo Go Feasibility
`expo-screen-capture` ships with Expo Go and provides `addScreenshotListener`, which fires a callback whenever the system detects a screenshot was taken. No custom dev client or native build required.

## Already in the Codebase
`expo-screen-capture` is already imported (but commented out) in `components/PuzzleEighteen.js`, confirming the dependency is available.

## Goal
Build `components/PuzzleFifteen.js` — a puzzle screen that detects when the user takes a screenshot and marks itself solved.

---

## Implementation Plan

### 1. Component file
Create `components/PuzzleFifteen.js`.

**Behaviour:**
- On mount, call `ScreenCapture.addScreenshotListener(callback)`.
- When the callback fires, set `solved = true`.
- On unmount, remove the listener.
- No permissions are required for screenshot detection on iOS or Android.

**UI states:**
| State | Display |
|-------|---------|
| Unsolved | Neutral prompt: "Take a screenshot to solve this puzzle." |
| Solved | Full-screen color fill + "Puzzle Solved" message (same pattern as PuzzleThirteen) |

**Color palette:** reuse `COLOR_PALETTE` / `getRandomColor()` pattern from PuzzleThirteen — pick a random color on solve.

### 2. Register in App.js
- Import `PuzzleFifteen` and add a `Stack.Screen` entry named `"PuzzleFifteen"`.
- Add a `Button` on `HomeScreen` → `"Go to 15th puzzle"`.

---

## Key API

```js
import * as ScreenCapture from 'expo-screen-capture';

// inside useEffect:
const subscription = ScreenCapture.addScreenshotListener(() => {
  setSolved(true);
});
return () => subscription.remove();
```

No async permission request needed — the listener works without it on both platforms.

---

## Edge Cases / Notes
- The listener should be removed on unmount to avoid stale callbacks if the user navigates away and back.
- `solvedRef` pattern (as used in PuzzleThirteen) should guard against the callback firing multiple times and triggering redundant state updates.
- On Android, `addScreenshotListener` may not be available on all OS versions — add a graceful fallback message if the subscription comes back null/undefined.
- Do not call `ScreenCapture.preventScreenCaptureAsync()` — that would block the very action needed to solve the puzzle.

---

## Files to Create / Modify
| File | Action |
|------|--------|
| `components/PuzzleFifteen.js` | Create |
| `App.js` | Add import, Stack.Screen, and HomeScreen button |
