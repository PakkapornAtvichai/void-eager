# VOID-EAGER — First-Time Navigation & Gameplay Playtest Audit

**Test date:** 30 October 2026
**Game commit tested:** `3ab90ee` (`main`)
**Environment:** `omnissiah`, local Vite preview at `http://127.0.0.1:5173/`, Chrome/Playwright.
**Purpose:** Respond to first-hand user feedback that navigation is confusing, then re-test as a first-time player rather than treating regression tests as proof of clarity.

**Scope:** REVIEW ONLY. The tests did not modify game source, NPCs, narrative, or assets. The findings below are confirmed observations unless explicitly marked as a recommendation.

**Status update (30 October 2026):** The UX-01 through UX-04 issues documented below have since been fixed and verified; see [post-playtest implementation and regression evidence](33-UX-REAL-INTERRUPTION-AND-FOCUS-FIX.md). This file is retained as the original reproducible audit of the *previous* build.

## 1. Test result summary

| Test / flow | Observed result |
|---|---|
| P0-A Work Order / room smoke | 5/5 passed |
| P0-A complete Loop 1, Pin and no Pin, Hub layouts | 6/6 passed |
| P0-B C-17 / context recovery | 7/7 passed |
| P0-B scroll restoration / once-only / console location | Passed |
| P0-C inspection / comparison / revisable theory | 10/10 passed |
| G0–G3 visual/keyboard/touch layout, four screen sizes | 4/4 passed |
| G4 physical Hub doors and Maintenance yellow Storage door | 4/4 screen sizes; observed-only Hub board and touch passed |
| First-time exploratory journey | 27 distinct stages, through C-17, Storage, saved theory, Reflection; completed |
| **Adversarial shorter route** | **Game also completed without an in-progress investigation interruption** |
| Workstation visible-choice inspection | **Choices clipped / below monitor viewport** |
| Storage RECHECK WORK ORDER destination | **Returns to Maintenance room, not focused Workstation** |

This verifies the route and app state **work technically**. It does **not** demonstrate that the UI is intuitive for a first-time human player or that the intervention achieves a research outcome.

The temporary Playwright scripts and all screenshots are **outside the Git repository**, in `D:\_work\yoko\VOID-EAGER-retest-qa` and `D:\_work\yoko\retest_*.log`.

## 2. Reproducible findings ordered by priority

### UX-01 — CRITICAL: End Session can bypass a genuine task interruption

**Repro (tested):**
1. Start in Maintenance and open the Workstation.
2. Open Work Order `WO-4471`; inspect **only Service Record**.
3. Back to Maintenance → Hub → CASE REVIEW.
4. Select **The recorded replacement happened**, cite the single observed Service Field, save theory.
5. At Hub, select **HANDLE C-17** even though no C-17 interrupted an active task.
6. Classify sensor mismatch, return to Hub, select END SESSION.

**Actual:** The game reaches Reflection. The Reflection summary says:
- `Interruptions encountered: 1`
- `Quick Pin used: No`
- `First thread resumed: None recorded`
- `Evidence logged: 1`

No deeply engaged task was interrupted or resumed, yet the central task-switching serious-game experience is reported complete.

**Expected:** P0-B/P0-D Loop 1 should require at least one C-17 interruption that **actually occurred during eligible active investigation**. Quick Pin can remain optional; whether the player returns to the same or another thread should not be graded. An early provisional theory must remain allowed; completion must not manufacture an interruption from a stationary Hub.

**Recommended fix:** Track `interruptionOccurredDuringInvestigation` separately from `secondaryTaskComplete`. Keep provisional Case Review ungated, but if the player saved an early theory and no real interruption occurred, Hub should direct them to resume eligible investigation instead of letting `HANDLE C-17` spawn the event. Preserve the once-only trigger and no-softlock guarantees. Adjust the Hub fallback and test the normal With/Without Pin routes plus new early-theory bypass regression.

**Screenshot:** `edge-audit\short-circuit-reflection.png`.

### UX-02 — HIGH: Workstation intention picker is outside the visible console

**Repro:** Open Work Order → inspect Parts (optionally also Completion) → close field dialog → see top objective `Choose what to check next`.

**Actual:** At **1464×815**, the `workorder-intentions` block begins about **6 px below** the visible report region. The screen shows the three Work Order rows and `TRACE PART SOURCE // B-04` but **none of the actionable focus choices**. At **1024×576**, the prompt heading becomes partly visible near the monitor bottom while the choice buttons remain clipped. There is no obvious visual scrolling affordance. Clicking `TRACE PART SOURCE` saves a lead **but does not select a working intention, navigate, or arm C-17**; after 30 simulated seconds, the pending alert did not occur.

**Expected:** The player should see the required focus choice without guessing that an in-world monitor scrolls. The CTA should reflect what it does (record a route lead vs choose an intention vs move to Storage).

**Recommended fix:** Replace the three large expanding intention buttons with a **single compact FOCUS row / selector inside the visible monitor**; retain the player-selected value, accessibility and existing C-17 arming semantics. Label `TRACE PART SOURCE` as a saved lead, not an implied teleport. Add a regression that asserts the currently needed focus control has an on-screen intersecting clickable box without manual scroll at all four screen sizes.

**Screenshots:** `journey\07-workstation-intentions.png`, `edge-audit\workstation-hidden-focus-1024.png`.

### UX-03 — MEDIUM: Storage RECHECK WORK ORDER does not open the Workstation

**Repro:** Inspect Work Order and Storage serial → `COMPARE SOURCES` → click `RECHECK WORK ORDER`.

**Actual:** Navigates to the Maintenance *room*, with the Workstation unfocused. The player must discover and click the physical workstation again. The button also uses a gray texture that can appear disabled.

**Expected:** The button should accurately communicate that it takes the player to the **Maintenance room**, then Workstation. Preserve the newly established physical-path navigation.

**Recommended fix:** Rename to `RETURN TO MAINTENANCE` / `WORKSTATION VIA MAINTENANCE`, and optionally highlight the Workstation hotspot upon return. Do not add a new Hub teleport shortcut.

**Screenshots:** `journey\19-compare-evidence-modal.png` and `journey\20-recheck-workorder-destination.png`.

### UX-04 — MEDIUM: Hub status words imply actions/events before they occur

**Repro:** First visit to Hub, before examining sources or receiving C-17.

**Actual:** Case Board badges show `00 SOURCES`, `OPEN COMPARE`, `OPEN C-17`. `OPEN` can read as an available action or currently active interruption even though neither comparison nor C-17 has been triggered.

**Recommended fix:** Use accurate statuses such as `NOT COMPARED`, `STANDBY` / `NOT TRIGGERED`, `PENDING` and `LOGGED`. Ensure status text is clearly **non-clickable**.

**Screenshot:** `journey\03-hub-before-case.png` and `edge-audit\caseboard-one-service-observation.png`.

### UX-05 — DESIGN CHOICE: First-time spatial orientation is still thin

**Repro:** Initial load and Case Brief.

**Actual:** The game **starts in Maintenance**, not in the Hub. The player can choose `OPEN WORKSTATION` immediately; the Hub's left/right corridor geography becomes visible only after deliberately using `← HUB CORRIDOR`. This is not a code failure but may contribute to the user's stated uncertainty about where the physical rooms are.

**Recommended direction:** Show a brief orientation cue in the opening case brief (e.g., `CURRENT LOCATION // MAINTENANCE`; `Hub: top-left exit; Storage: yellow right doorway`) or consider opening at Hub for the polished version. Do not change the start scene without checking against the short vertical-slice design and user preference. Keep the brief compact.

**Screenshots:** `journey\01-initial-brief.png`, `journey\02-initial-maintenance.png`, `journey\03-hub-before-case.png`.

### UX-06 — KNOWN SCOPE ITEM: Reflection questions cannot be answered

**Actual:** Reflection lists three questions as static text. No input or skip/opt-out control. The game labels a successful completion even if no meaningful context recovery happened (see UX-01).

**Next phase:** P0-D interactive, neutral, opt-out Reflection. Avoid framing the three questions as a diagnostic or a performance score.

**Screenshot:** `journey\27-reflection.png`.

## 3. What the new navigation gets right

- Hub **left physical corridor → Maintenance room**, and right physical corridor → optional Engineering/Power Log are both clickable and keyboard/touch available.
- Maintenance Workstation, Workbench, and Junction are individually inspectable. The **yellow right-hand door → Storage** is a distinct hit area from Junction; tested nonoverlap at four sizes.
- Storage exits back into Maintenance. Hub's central screen **no longer teleports** the player; it shows only observed case sources and theory actions.
- C-17 still persists across room movement; once handled it allows explicit return to the previous task or Hub. Workstation scroll is restored.
- Serial comparison has separate, attributed Maintenance and Storage sources; a saved comparison does **not** auto-choose the theory. Theory can be revised when new evidence appears.
- Loop 1 completes normally both with and without a Quick Pin.

## 4. Suggested repair order

1. **Close UX-01** (the meaningful-interruption bypass), with a dedicated regression for early theory and Hub C-17 fallback.
2. **Close UX-02** (Workstation focus visibility at 1024×576 and 1464×815) and clarify Trace Part Source.
3. **Close UX-03 and UX-04** (accurate destination labels and case status microcopy).
4. Confirm the preferred first-time starting location/orientation (**UX-05**) in a brief human playtest.
5. Complete **P0-D** interactive Reflection (**UX-06**), then retest with unfamiliar players.

**No source code was changed as part of this audit.** The issues above remain open until implementation and re-verification.
