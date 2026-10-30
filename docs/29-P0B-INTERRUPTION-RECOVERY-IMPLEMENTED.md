# VOID-EAGER — P0-B Interruption & Context Recovery (Implemented)

**Date:** 30 October 2026
**Status:** P0-B IMPLEMENTED; tested against the Loop 1 final design. No new characters, rooms, evidence, artwork, or AI.

## What changed

1. **Meaningful trigger rather than a 12-second report timer.** C-17 arms when the player chooses a working intention at Workstation, or physically inspects the Coupler after opening the Storage crate. It delivers after ~7 seconds of cumulative eligible investigation time, not when simply opening the Work Order. The timer pauses outside Workstation/Storage, while an evidence or Help dialog is open, and during transitions. The alert is delivered once per run.
2. **Pending remains pending.** The alert may be minimized, persists across Hub/Storage/other scene changes, and can be opened again from the pending tab. It no longer appears above a Work Order or Storage evidence dialog during the normal trigger path.
3. **Player-selected Quick Pin.** SAVE CONTEXT presents short choices based on *the work actually visited before the alert*, rather than copying a developer-authored clue. Workstation prioritizes the player's active intention; Storage-first offers physical-object tasks such as reading the serial. Player confirms with SAVE THIS NOTE; saving does not resolve C-17, and Pin may be edited until handling begins. No unseen serial or installation conclusion is prefilled.
4. **Return to previous task OR Incident Hub.** After classifying C-17, both buttons are offered. Return restores the captured Workstation or Storage location; Workstation report scroll offset and active focus persist, and Storage reopens at the previously inspected physical phase. If the incident interrupts Storage, its display uses a neutral shipwide remote-console backdrop rather than falsely depicting a physical teleport back to Maintenance.
5. **Can't skip the serious-game core.** A saved theory is not enough to end the demo. End Session requires a resolved C-17. If a player reaches Hub after filing a theory without an alert response, an explicit REVIEW SHIP ALERT C-17 button opens that duty, without blocking earlier exploration or theory saving.
6. **Neutral coolant feedback.** All three operational responses remain accepted. Confirmation describes the recorded action and does not grade the player's choice.
7. **Accurate process tracking.** Saving a Pin is not counted as using it. Reflection's Quick Pin Used flag reflects actual viewing/resumption; first resumed thread now includes returning to Storage; the interruption count is driven by completed incident state, not a hardcoded constant.

## Files changed

- `src/game/types.ts`, `src/game/state.ts`: interruption arming, recovery snapshot, player-saved cue, reviewed Pin, guarded End Session.
- `src/app/GameApp.tsx`: cumulative active-work timer, safe eligibility, pending alert, frozen context/choices, return to original scene.
- `src/components/IncomingInterruption.tsx`: accessible radio-based SAVE CONTEXT choice, editable until handled.
- `src/components/SecondaryScene.tsx`: neutral response, deliberate Previous Task / Hub actions and remote system display.
- `src/components/StorageScene.tsx`, `src/components/WorkstationFocusScene.tsx`, `src/components/ObjectiveTracker.tsx`: report when an evidence/Help dialog is open so the alert waits.
- `src/components/HubScene.tsx`: explicit outstanding C-17 fallback, don't show End Session prematurely.
- `src/components/StatusRail.tsx`, `src/components/ReflectionScene.tsx`: distinguish Pin saved/reviewed, restore the chosen destination, accurate summary.
- `src/game/objectives.ts`, `src/styles.css`: revised wayfinding and responsive alert / return controls.

## Test evidence

**New reproducible Playwright checks:**

- `tests/p0b_interruption_recovery.py`: seven paths covering Workstation no-arm before focus; modal pause; player-selected no-spoiler cue; previous-Workstation return; Storage-first arm/modal pause/return; minimized alert across rooms; required-C-17 final gate and Hub fallback; saved-but-not-used Pin in reflection; cumulative eligible timing; and 1024×576 modal fit.
- `tests/p0b_edge_regression.py`: Workstation scroll restoration, only-one-C-17 delivery even after long simulated time, keyboard focus on Pin choices, and remote-console backdrop from Storage.

**Existing suites retained and run:** `tests/p0a_navigation_smoke.py` (5 paths), `tests/p0a_loop_regression.py` (6 paths; adapted only for new two-step player-selected Pin), and `tests/g0_g3_visual_layout.py` (4 sizes plus keyboard/touch).

Test setup: run Vite on `http://127.0.0.1:5173/`, install Python Playwright with Chrome, then execute the scripts in `tests/`. Set `VOID_EAGER_TEST_OUT` to save screenshots elsewhere. Existing test assets and art are unchanged.

**Browser screenshots** were also checked at `D:\_work\yoko\VOID-EAGER-p0b-qa`.

## Intentionally NOT in P0-B

- **P0-C:** Work Order currently enters the evidence count when opened; Case Review still shows a premature Work Order matching-serial citation on Storage-first, cannot revise after saving, and Storage comparison remains mostly guided.
- **G4–G6:** Workstation focus choices still extend below its visible report; Storage plaque/Hub/compact HUD and Pin's floating panel await the specified graphic cleanup.
- **P0-D:** Reflection questions remain static, not interactive.
- **Optional Power Log:** Its conclusion currently appears before inspection; the P0-C/source-fidelity pass should address this.

**Next priority:** P0-C evidence and deduction integrity, followed by remaining G4–G6 UI cleanup and P0-D neutral interactive Reflection. Do not reopen the historical multiroom story during this vertical-slice pass.
