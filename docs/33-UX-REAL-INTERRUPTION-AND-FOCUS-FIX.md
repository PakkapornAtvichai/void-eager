# VOID-EAGER — Post-Playtest UX Fix: Genuine C-17 & Visible Focus

**Date:** 30 October 2026
**Status:** Implemented and browser-verified on `omnissiah`.
**Based on:** [Independent playtest audit](32-NAVIGATION-PLAYTEST-UX-AUDIT.md), especially UX-01 through UX-04.
**Scope:** Preserve the existing 5–10-minute Coupler investigation, free room order, physical Hub corridors, optional Quick Pin, all three coolant responses, and neutral provisional theory. No new story, NPCs, rooms, artwork, or AI.

## 1. UX-01 resolved: completion requires an actual interruption and task re-engagement

**Previous bug:** The player could inspect a single Service field, save a provisional theory, click **HANDLE C-17** on the Hub computer (even though no investigation was interrupted), and reach Reflection with `First thread resumed: None recorded`.

**Implementation:**
- Added `interruptionOccurredDuringInvestigation` to `GameState`, initialized `false`, and set only through a validated `TRIGGER_INTERRUPTION` action with the original `ReturnPoint`. The reducer rejects the trigger unless C-17 was armed and originated during an actively focused Workstation task or a previously inspected physical Storage Coupler. A Hub button cannot impersonate an eligible trigger.
- `GameApp` triggers C-17 **only via the cumulative active-work timer**. Both the timer's eligibility and the reducer validate the Workstation intention or inspected Storage object. Opening a record, entering a room, reading an initial Service field, or standing in the Hub cannot create the interruption.
- A theory can **still be saved early** after any actual Coupler observation, without gating the Case Board or forcing evidence order. The Hub now explains how to continue investigating; it does **not** offer a synthetic C-17 button while the alert is idle.
- Once a **real** C-17 warning exists, the Hub may reopen it while pending (as may the Pending tab). Minimize, handle, return-previous/HUB, optional Pin and saved cue remain as designed.
- An ending now needs **all of:** a saved theory; a resolved C-17 **originating from active work**; and at least **one real investigation action after C-17**. Walking into a room, merely opening the Workstation, or clicking Return to Previous Task does not satisfy the recovery requirement. Re-inspecting an evidence field, deliberately choosing a focus, inspecting the Storage unit/serial, saving an eligible comparison, or inspecting an Engineering log does. This requirement is neutral about the *chosen* thread; no strategy is graded as correct.
- `firstThreadAfterInterruption` is recorded upon that first **post-C-17 activity**, not upon a room doorway or navigation shortcut. The Reflection summary no longer counts an empty room visit as task recovery.
- The Hub provides distinct messages for **saved theory but no actual C-17**, **real alert pending**, and **alert resolved but no task re-engagement**. `End Session` is rendered only once the same guards allow `OPEN_REFLECTION` in the reducer.

**Relevant files:** `src/game/types.ts`, `src/game/state.ts`, `src/app/GameApp.tsx`, `src/components/HubScene.tsx`, `src/game/objectives.ts`.

## 2. UX-02 resolved: next focus always visible on the Workstation

**Previous bug:** After inspecting Completion or Parts, the required `WHAT WILL YOU CHECK NEXT?` buttons appeared **below the internal scroll viewport** of Glint's monitor, including at 1464×815 and 1024×576. Players were told to choose a focus but could not see the controls.

**Implementation:**
- Replaced the long group of focus buttons embedded in the scrollable Work Order with one **fixed, keyboard-accessible `NEXT CHECK` select** above the source rows. It only lists choices made eligible by actually inspected fields; it remains visible when the Work Order content scrolls.
- The selected investigation intention persists across C-17, Hub travel and return, and still arms the interruption only when the player explicitly chooses it. Quick Pin continues to prioritize the selected intention.
- The optional `TRACE PART SOURCE // B-04` button is now **`SAVE B-04 LEAD`**, adjacent to the selector. Its title explicitly says that it saves a route note; travel still occurs through the yellow physical Maintenance door, never by teleport.
- Existing Work Order field modals, source facts, serial and scroll-restoration behavior are unchanged.

**Relevant files:** `src/components/WorkstationFocusScene.tsx`, `src/styles.css`, updated P0-A/P0-B browser tests.

## 3. UX-03 and UX-04 resolved: honest directions and Hub statuses

- Storage compare action now says **RETURN TO MAINTENANCE** and still goes to the actual Maintenance room. The action now looks enabled (cyan), not like a disabled gray button. It does **not** teleport through the physical Workstation scene.
- Hub comparison status now reads `NOT SAVED` rather than `OPEN` before any comparison is saved, and C-17 reads `STANDBY` rather than `OPEN` before a real alert exists. `PENDING` and `LOGGED` still reflect the appropriate states.
- The Hub's **next available action and recovery instructions appear above the observed-source index**, so they are not buried underneath a long list of inspected sources at 1024×576. Regression tests also check that these instructions fit inside the Hub monitor.

## 4. Browser verification

**New regression suite:** `tests/p0b_ux_completion_gate.py` covers:
- The exact one-Service-field early-theory exploit; C-17 cannot be summoned or counted from Hub.
- A real active Workstation interruption, pending alert reopening from Hub, subsequent response, and **no End Session until an actual source action occurs after C-17**.
- Entering Maintenance and Workstation without inspecting anything is **not** counted as task recovery.
- Storage-first with an early provisional theory; actual Storage interruption; saved-but-not-reviewed Pin; real post-C-17 serial inspection and correct Reflection record.
- The always-visible, clickable `NEXT CHECK` selector and its saved selection at **1024×576, 1280×720, 1464×815, 1920×1080**.
- The accurate Storage compare-return destination and label.
- The early-theory bypass and recovery flow also at **1024×576**.

**Existing regression suites updated only for the changed native select controls / stricter completion rule:**
- `tests/p0a_navigation_smoke.py`: 5/5.
- `tests/p0a_loop_regression.py`: 6/6, including both with/without Pin and Reflection.
- `tests/p0b_interruption_recovery.py`: 7/7, including deferred/Storage-first/Pending and cumulative eligible work.
- `tests/p0b_edge_regression.py`: Workstation scroll recovery, C-17 once, neutral Storage console.
- `tests/p0c_evidence_deduction.py`: 10/10.
- `tests/g0_g3_visual_layout.py`: 4 sizes + keyboard/touch.
- `tests/g4_physical_navigation.py`: 4 sizes + physical door and touch checks.
- `npm run build`, `git diff --check`: PASS.

Browser screenshots saved **outside the repository** at `D:\_work\yoko\VOID-EAGER-uxfix-qa` (focus selector at all four sizes, early-theory blocked, C-17 active, post-alert recovery gate, resolved Storage label and successful Reflection).

## 5. Remaining work, not claimed complete

- **P0-D:** Reflection questions are still static and not answerable/optional. Implement neutral, player-answerable reflection without ability grading or diagnostic language.
- **G5–G6:** Further Hub/Storage/HUD visual refinement and modal/popover hierarchy. The fixed Workstation focus toolbar is complete, but this does **not** mean every graphic cleanup item is done.
- **Human playtesting:** Automated clicks, screenshots and keyboard checks do not replace a first-time-player observation of navigation clarity, interruption cost and task recovery.
- **First-time location cue:** Opening scene still begins in Maintenance; spatial onboarding relative to the Hub may merit a brief player-facing orientation, without adding a separate prologue.

This implementation **closes UX-01 through UX-04** from the 30 October audit. The original audit remains as historical evidence of the bugs, not a statement that they are still present.
