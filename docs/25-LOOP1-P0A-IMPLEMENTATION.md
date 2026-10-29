# VOID-EAGER — P0-A Investigation Foundation

**Date:** 30 October 2026
**Status:** IMPLEMENTED and browser-tested. **P0-B / P0-C / P0-D are not implemented yet.**
**Design contract:** [Final Gameplay Spec](24-LOOP1-FINAL-GAMEPLAY-DESIGN.md) and [Thai overview](24-LOOP1-FINAL-GAMEPLAY-DESIGN-TH.md)

## Playable changes

1. **Work Order has three independent inspections.** The player opens WO-4471, then selects Service Record, Recorded Completion, and Parts Reference in any order. Each click opens the existing centered evidence modal, with Close/Escape.
2. **Player chooses the investigative focus.** After inspecting relevant fields, the player may select Check completion, Trace issued part, or Look for installation verification. The chosen focus persists after scene changes and may be changed.
3. **No automatic investigator conclusion.** Removed the old "INVESTIGATOR'S QUESTION / where is installation proof?" line. The document presents source facts without declaring what happened.
4. **Storage Lead ungated from C-17.** Trace Part Source B-04 is available after reading the parts reference. Creating the lead does not teleport the player. The follow action is separate and works before the coolant alert.
5. **Free order of locations.** Incident Hub is accessible before coolant completion, and Hub offers explicit Workstation / Storage B-04 buttons. Storage can be visited before the Work Order or a Lead.
6. **Storage-first has no unseen-document spoiler.** The part's physical serial can be read, but the unvisited Work Order shows NOT YET INSPECTED. In early Case Review the unread Work Order is not a selectable citation.
7. **Minimal safety fix for unresolved C-17.** The pending incident tab can be reopened from Hub or Storage. The full interruption/resumption redesign remains in P0-B.
8. **Existing art remains.** Field actions are contained within the Workstation art's monitor; Hub navigation has fit-tested labels.

## Changed files

- src/components/WorkstationFocusScene.tsx — independent fields and chosen focus
- src/game/types.ts; src/game/state.ts — observed-field and active-intention state
- src/app/GameApp.tsx — navigation/prop integration
- src/components/HubScene.tsx — early Workstation and Storage routes
- src/game/objectives.ts — updated non-spoiling guidance
- src/components/StorageScene.tsx — hide unread document facts
- src/components/DeductionScene.tsx — cite observed sources only
- src/styles.css — in-world controls and responsive layout

## Browser QA

Automated Chromium Playwright checks passed at **1024x576, 1280x720, 1464x815, 1920x1080**. Verified independent Work Order clicks, no new leads before reading Parts Reference, focus selection and persistence, a traced Lead before C-17, player-directed Storage visit, Storage-first without unseen Work Order facts, and Hub accessibility. The full old Coupler loop reaches Reflection both **with and without Quick Pin**. No JavaScript page errors observed. Production build and diff check pass.

**Regression scripts committed in this repository:**
- tests/p0a_navigation_smoke.py — 5 checked paths including 4 screen sizes and Storage-first
- tests/p0a_loop_regression.py — both Pin modes and all 4 screen sizes at Hub

To run: start the Vite development server on 127.0.0.1 port 5173, install Python Playwright and have Google Chrome available, then run the two scripts using Python. Screenshots are written to the operating-system temporary directory by default; VOID_EAGER_TEST_OUT overrides the location.

## Intentionally remaining work

- **P0-B:** C-17 STILL uses the old 12-second timer after opening a report. Quick Pin STILL saves a developer-written string and coolant completion STILL goes to Hub. Next pass must replace those with meaningful task triggering, player-selected cue, and direct return to interrupted task. No claim that this new mechanic works yet.
- **P0-C:** Storage's current inspection steps and comparison remain mostly the old sequence. Manual compare-and-file and theory revision remain.
- **P0-D:** Reflection still consists of noninteractive questions; fresh-player usability testing remains.

**Do not add** new rooms, NPC dialogue, puzzles, art or AI. Keep Loop 1 only.

## Next implementation step

Start P0-B from the final gameplay design and preserve P0-A's field observations, chosen intentions, independent Storage access and existing Case Review route. Re-run both regression scripts after implementation.
