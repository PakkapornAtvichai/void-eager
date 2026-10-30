# VOID-EAGER — Graphic Cleanup G0–G3 implementation report

**Date:** 30 October 2026
**Status:** G0–G3 IMPLEMENTED AND TESTED. G4–G6 and final all-screen G7 NOT YET COMPLETE.

**References:** [Option B wireframes](26-LOOP1-UI-MOCK-LAYOUT-SPEC.md) · [Option A checklist](27-LOOP1-UI-IMPLEMENTATION-CHECKLIST.md) · [Gameplay contract](24-LOOP1-FINAL-GAMEPLAY-DESIGN.md).

## Actual changes shipped in this phase

- **G0 / baseline:** Captured the old opening/room/Workstation/Hub/Storage at 1024×576, 1280×720, 1464×815, and 1920×1080. Verified the letterboxed **16:9 game-stage** coordinates, not raw browser-space positions. Baseline artifacts remain outside the repository at `D:\_work\yoko\VOID-EAGER-ui-cleanup-qa`.
- **G1 / centered case briefing:** Created `src/components/CaseBriefDialog.tsx` with an accessible centered dialog, full-stage backdrop, Close/Escape, **OPEN WORKSTATION**, **EXPLORE ROOM**, and Tab cycling. The previous blue left briefing panel was removed from MaintenanceRoomScene. One-time dismissal persists in the current loop; Restart resets it. The brief can be reopened through **HINT → CASE BRIEF** while in the Maintenance room.
- **G2 / smaller objective:** Narrowed the in-game objective strip to ~450×50 at the 1464px reference viewport, ~340×48 at 1024px, retaining a short objective and an optional Hint button. Objective is hidden while the brief dialog is open. Storage still owns its single phase-based objective (no duplicated tracker).
- **G3 / hotspots and Hub exit:** Moved **← HUB** to the top-left, away from Junction. Removed the late CSS override that forced all enabled hotspot labels to be permanently visible. A 14px glowing reticle stays visible at rest; label appears on hover/focus, or remains visible for coarse-pointer/touch devices. Existing large clickable hotspots and their accessible names remain intact. Mouse hovering no longer lights up the full Workbench hit-area rectangle.
- **Modal accessibility:** Extended EvidenceModal's focus cycle to allow additional actions inside the Hint modal, without letting keyboard focus escape behind it. Reopening Case Brief closes Hint first.

**Files changed:**
`src/app/GameApp.tsx`, `src/components/CaseBriefDialog.tsx` (new), `src/components/MaintenanceScene.tsx`, `src/components/MaintenanceRoomScene.tsx`, `src/components/ObjectiveTracker.tsx`, `src/components/EvidenceModal.tsx`, `src/styles.css`.

## Verified browser behavior

| Check | Result |
|---|---|
| `npm run build` | PASS |
| `git diff --check` | PASS |
| P0-A navigation smoke | PASS 5/5 paths, including 4 viewports and Storage-first |
| P0-A complete Loop 1 regression | PASS 6/6 paths, including Pin and no-Pin |
| New G0–G3 stage-aware layout test | PASS at 1024×576, 1280×720, 1464×815 and 1920×1080 |
| Opening brief centered and dismissible | PASS; Escape and actions tested |
| Hint → Case Brief without stacked dialogs | PASS |
| Objective and Hub exit do not overlap | PASS at all tested widths |
| Hotspot labels hidden at rest, visible on hover | PASS after CSS transition settles |
| Keyboard tab/reverse-tab, Hint modal action | PASS |
| Touch/coarse pointer labels and Workbench activation | PASS |
| Page errors on tested browser paths | 0 |

**Automated test added:** `tests/g0_g3_visual_layout.py`. The existing two P0-A scripts remain unchanged and continue to pass. Preview remains available at `http://localhost:5173/` on the connected computer.

## Actual screenshots checked

The after screenshots show Maintenance's room art unobstructed when the brief is closed; the briefing is centered, and Hub navigation no longer covers Junction. The desktop CSS baseline had permanently visible labels (opacity 0.93); after this pass labels are hidden at rest and appear on interaction. The extra large Workstation menu, Storage/Hub layout and tall bottom HUD are **not** fixed in G0–G3.

## Remaining graphic cleanup (do not call finished)

- **G4:** Collapse Workstation's three focus options into one compact selector while retaining all P0-A choices and tests.
- **G5:** Simplify optional inspection overlays, Storage plaque and Hub emphasis.
- **G6:** Shorten bottom HUD; ensure one intentionally opened Pin/modal surface; verify C-17 pending does not visually overlap.
- **G7:** Full screenshot and end-to-end regression review across all four viewports after G4–G6.

**Known gameplay debt, untouched by this pass:** Old 12-second interruption timer, prewritten Pin text and Hub-only cooldown return. These belong to **P0-B**, after graphic cleanup. P0-C comparison and P0-D reflection likewise remain deferred.
