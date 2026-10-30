# VOID-EAGER — Browser Playtest After Genuine C-17 / Focus Fix

**Date:** 30 October 2026
**Build tested:** `c9c4d8d` on `main`
**Environment:** `omnissiah`, Chrome via Playwright, Vite at `http://127.0.0.1:5173/`
**Scope:** **Review only; no game source or art changed in this pass.** This is a follow-up to `docs/33-UX-REAL-INTERRUPTION-AND-FOCUS-FIX.md`.

## Summary

The latest Loop 1 works end-to-end through **Workstation → real C-17 → optional Quick Pin → task return → Storage source comparison → Theory → Reflection**. The previously reported Hub-generated C-17 shortcut was not reproducible. Two small-landscape UI problems remain and are directly visible in screenshots; one makes the Storage primary-action label nearly invisible, and the other initially obscures the final Restart button. Reflection questions also remain noninteractive, as already scoped for P0-D.

This was an exploratory **browser-operated** playtest, not a study with a human participant. Screenshots and trace logs are kept **outside the Git repository** in `D:\_work\yoko\VOID-EAGER-human-route-audit`.

## Gameplay routes exercised

1. **Workstation first, real elapsed alert, Quick Pin, full case** at **1464×815**. Began with the actual Case Brief; opened Glint's Work Order, inspected Completion and Parts, selected `Look for installation verification`; the real browser timer delivered C-17 **about 6.95 seconds** later, without an artificial dispatch. Saved the selected task cue, classified sensor mismatch, returned to the same Workstation, confirmed the chosen focus persisted, re-inspected Service, physically entered Storage, opened the crate, read serial then condition, explicitly compared two source serials, saved the comparison, filed the `not-replaced` theory, reviewed Quick Pin from the Hub, and reached Reflection. The ending reported one interruption, used Quick Pin, and the Coupler thread as first re-engaged.
2. **Storage first, minimized C-17, alternate Engineering activity** at **1280×720**. Left the opening brief via Explore Room, entered Storage through its physical yellow door, inspected Coupler condition, received C-17, minimized it, changed rooms, reopened the pending incident, selected **emergency isolation** (recorded without grading), returned to Hub, inspected Engineering 21:11 and 21:12 source entries, and filed a provisional theory with only actually inspected Storage evidence. The ending correctly reported **Power Spike** as the first thread re-engaged and `Quick Pin used: No`; no uninspected Work Order details appeared as citations.
3. **Early theory / attempted shortcut** at **1024×576**. Opened a Work Order Service field, saved a provisional `replaced` theory, returned to Hub and verified it offered **no** C-17 spawn or End Session. Waiting at Hub did not cause C-17. After reading Completion and selecting a real next check, the alert triggered during Workstation focus. Resolving it and returning to Hub did **not** unlock completion; repeatedly visiting Maintenance/Workstation also did **not** count as recovery. Re-inspecting the Completion source did, at which point End Session was available and Reflection was reachable. Thus the earlier serious-game shortcut is closed.

**Functional status:** All three exploratory paths passed; no browser JavaScript exceptions were reported. The existing automated P0-A/B/C/G0–G4 suites had been verified at the implementation checkpoint, but this report does not pretend those tests substitute for a novice human playtest.

## Confirmed outstanding UI findings

### HIGH — UX-07: Storage `OPEN CRATE` CTA hidden by HUD at small sizes

The player **can click the crate artwork**, so the route is not technically blocked. However, the explicit CTA label is positioned under the bottom HUD.

| Viewport | `OPEN CRATE` label | Bottom HUD begins | Result |
|---|---|---|---|
| **1024×576** | y = 554–597 | y = 483 | Label mostly off-screen/behind HUD; its center is outside viewport |
| **1280×720** | y = 603–646 | y = 625 | Lower ~20 px covered by HUD |
| **1464×815** | y = 626–669 | y = 719 | Clear |
| **1920×1080** | y = 843–886 | y = 981 | Clear |

Screenshots: `probe-storage-closed-1024.png`, `probe-storage-closed-1280.png`, and `B02-storage-unseen.png`. These are stronger evidence than a simple Playwright success: clicking the large crate via the locator is possible even when its identifying label is obscured.

**Recommended fix:** Place a compact `OPEN CRATE` label/button *above the HUD-safe area*, visibly associated with the clickable crate. On 1024×576 and 1280×720, anchor the cue relative to the safe scene area rather than to the bottom of the oversized crate image. Keep the crate itself clickable and preserve the detailed pixel art.

### HIGH — UX-08: Reflection `Restart prototype` initially hidden by HUD at 1024×576

At **1024×576**, the Reflection panel is internally scrollable by about **75 px**. Initially its Restart button is at y = **518–562** while the HUD begins at y = **483**; a hit test at the button center instead lands on the HUD. An automated locator can scroll the panel for the player, moving the button to around y = **443–487**, after which its center is clickable. Thus this is **an undiscoverable-scroll/visual-overlap issue**, not a permanently unreachable control.

Screenshots: `probe-reflection-initial-1024.png`, `probe-reflection-after-trial-1024.png`, `probe-reflection-manual-scroll-1024.png`.

**Recommended fix:** Make the Reflection panel's visible area end above the HUD and retain a clearly accessible Restart action in a sticky, visible footer. The existing neutral, opt-out P0-D questions can then live in the scrollable content area.

### MEDIUM — UX-09: Reflection is informational only, not answerable

The three questions about remembering the prior task, first thread returned to, and changing an interpretation are static paragraphs. No answers or skip are available. The screen says `You completed the prototype loop` and provides a Restart control, but cannot record the player's own process reflection.

**Recommendation:** Complete the already-approved P0-D plan: three lightweight neutral answers, optionally skipped, no score/diagnostic statement.

### LOW/MEDIUM — UX-10: First-time orientation and visual continuity

- The opening scene still begins directly in Maintenance. A first-time player sees `OPEN WORKSTATION` and `EXPLORE ROOM`, but the brief doesn't explain that the Hub is accessed via its upper-left exit or that the yellow right-hand Maintenance door leads to Storage. The Hub is spatially meaningful once visited; early orientation may still require one short line rather than a new map.
- Engineering's Hub corridor leads directly to the Power Log interface, not a spatial Engineering room, unlike the left Hub corridor. This is intentionally scoped and not a broken route.
- Storage's surrounding room visuals are flatter and simpler than the detailed Maintenance/Hub scenes. This is an aesthetic consistency issue, not a functional failure.

### EXPERIENCE NOTE — UX-11: Interruption may still feel like waiting

C-17 arrived after choosing a focus and **doing nothing further** for ~7 seconds on the Workstation. This satisfies the current active-focus timer design but a human may not feel the cost of losing a complex in-progress task. Before adding features, observe one unfamiliar player's behavior at this exact point and decide whether there is a naturally ongoing evidence comparison to interrupt.

## What was demonstrably fixed

- `NEXT CHECK` is visible and retains state on the Workstation.
- Hub no longer manufactures an idle C-17; genuinely pending alerts remain reopenable across rooms.
- Handling C-17 alone is insufficient to finish; an actual post-alert inspection/task activity is required.
- Storage-first investigation works; its two serial sources compare explicitly and do not auto-choose a verdict.
- Power Log 21:12 result remains hidden until inspected; returning to a different thread after C-17 is allowed and recorded honestly.
- Early theory and either interpretation remain provisional, not correctness-scored.

## Recommended immediate order

**Next UI pass:** fix **UX-07 (Storage CTA)** and **UX-08 (Reflection button safe area)** first, then implement **P0-D interactive Reflection**. The remaining orientation and aesthetic items can be handled with small targeted changes. Maintain the current physical door navigation and verified C-17 logic.

**Files changed in this report commit:** audit/documentation only; the tested game commit remains `c9c4d8d`.
