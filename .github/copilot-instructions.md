# Copilot Instructions for glassbox

## Project Overview
- This repository is an Expo + React Native app with puzzle screens.
- App navigation is configured in App.js using @react-navigation/native and a native stack navigator.
- Puzzle implementations live in the components folder.

## Tech Stack
- React 18 + React Native 0.81
- Expo SDK 54
- React Navigation native stack
- Jest with jest-expo preset
- @testing-library/react-native for UI tests

## Priority When Making Changes
- Keep behavior of existing puzzle screens stable unless the prompt asks for behavior changes.
- Prefer small, focused edits over broad refactors.
- Preserve the current structure where each puzzle screen is an isolated component.
- Keep App.js route names stable because tests and navigation depend on them.

## Coding Guidelines
- Use functional React components and React hooks.
- Keep side effects inside useEffect with proper cleanup for listeners/subscriptions.
- For sensor or system-event features (Appearance, DeviceMotion, etc.), always remove listeners/subscriptions on unmount.
- Keep UI styles in StyleSheet.create blocks near the component.
- Avoid adding new dependencies unless clearly needed.
- Match existing JavaScript style in the touched file (quotes, spacing, semicolons) instead of reformatting unrelated lines.

## Puzzle-Specific Guidance
- Puzzle components should expose clear user feedback states (for example: progress, solved, retry).
- If puzzle logic depends on device sensors or platform APIs, handle missing/unavailable data defensively.
- Avoid magic behavior hidden across files; keep puzzle logic local to the puzzle component unless explicitly shared.

## Testing Guidance
- Add or update Jest tests for behavior changes.
- Use @testing-library/react-native (render, screen, fireEvent, waitFor, act) for interaction and assertions.
- Mock platform/system APIs such as Appearance or sensor listeners in tests.
- Keep tests behavior-focused (what user sees/does) instead of implementation-detail assertions.
- Ensure tests are deterministic and do not depend on real device hardware.

## Commands Copilot Should Prefer
- Install dependencies: npm install
- Run app (Expo): npm run start
- Run iOS native build: npm run ios
- Run Android native build: npm run android
- Run tests: npm test

## File and Change Safety
- Do not edit ios native files unless the task explicitly requires native changes.
- Do not rename routes, component exports, or test files unless requested.
- Avoid broad formatting-only changes.
- Keep commits and diffs tight to the user request.

## When Unclear
- Ask a targeted question if a requirement is ambiguous.
- If only one screen is requested, limit changes to that screen and related tests.
