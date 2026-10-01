# Frontend Test Brief

## Testing boundary

The vertical slice is feature-complete through reflection. Frontend testing should evaluate behavior, clarity, visual hierarchy, accessibility basics, and the difference between pinned and unpinned resumption.

Do not add features during the test. Record findings first.

## Run A — Quick Pin path

1. Start from Maintenance.
2. Inspect the coupler work order.
3. At the interruption, choose **Quick Pin & Open**.
4. Complete the coolant-alert classification.
5. Return to the investigation.
6. Observe the pinned resumption cue.
7. Go to Storage.
8. Inspect the replacement coupler.
9. Compare its serial with the work order.
10. Open the deduction.
11. Submit the supported conclusion.
12. Continue to reflection.

## Run B — No Pin path

Restart the prototype and repeat the same flow, but choose **Open without pin** at the interruption.

On return, verify that the investigation is still recoverable but the detailed Quick Pin context cue is absent.

## Negative-path checks

- In the coolant task, intentionally choose an over-escalated response once. Verify that the player can reconsider without losing progress.
- In deduction, try the incorrect conclusion once. Verify that the game explains the unresolved contradiction and permits another attempt.
- Try submitting a deduction without the full evidence chain selected. Verify that the player is prompted to support it rather than blocked silently.

## UX questions

- Is it always clear what the next meaningful action is?
- Does the interruption feel like a genuine context switch rather than a random popup?
- Is Quick Pin understandable before using it?
- Is the pinned return meaningfully different from the unpinned return without giving away the answer?
- Can the Storage serial cross-check be understood without explanation?
- Does the deduction feel earned rather than obvious?
- Does reflection feel neutral rather than evaluative?
- Are buttons, focus states, text size, contrast, and responsive layout usable?

## Report format

For every issue record: severity, scene, exact reproduction steps, expected behavior, observed behavior, and suggested fix.

Separate functional bugs from UX observations and visual-polish suggestions.
