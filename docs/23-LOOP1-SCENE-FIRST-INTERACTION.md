# VOID-EAGER — Loop 1 Scene-First Interaction Pass

Updated: 2026-10-28

## What prompted the revision

First-time-player screenshots showed that Workbench/Junction descriptions and the Storage inspection panel remained on screen, obscuring detailed Yoko environment art. Text in an incoming C-17 alert and Hub buttons did not fit neatly. An unhandled alert appeared to disappear when leaving the Workstation, despite the state machine still reporting it as pending. The player also experienced too much reading and insufficient contextual clarity.

## Scope decision

**Only the existing Coupler Loop 1.** No new rooms, case threads, puzzles, evidence flags, or story branches. The full opening conversation was explicitly postponed and has **not** been added in this revision.

## Changes implemented

### Inspection / evidence
- Workbench and Junction start as unobstructed focused artwork with clickable evidence hotspots.
- Clicking a specific detail opens one **centered EvidenceModal** containing a short observation.
- Every evidence modal has an explicit **CLOSE** button; Escape and clicking outside also close it. Closing returns focus to the scene and does not navigate elsewhere.
- The inspection image itself is not replaced by a fixed reading panel.
- Optional Workbench/Junction observations still do not change evidence count or knowledge flags.

### Storage
- Removed the always-visible right-side inspection text panel.
- The crate, Coupler and serial-plate art now occupy the main visual field.
- Each physical action opens a small centered description: **Open crate → Close → Inspect Coupler → Close → Find serial → Close**.
- The Serial comparison is available only after identifying the serial plate, and can be reopened using **REVIEW SERIAL**.
- Bottom HUD and existing Storage Lead / Evidence logic are unchanged. Nothing is automatically visited or solved.

### C-17 interruption persistence
- The amber incident dialog is centered and uses short text with readable **SAVE CONTEXT** and **HANDLE ALERT** actions.
- **LATER / MINIMIZE** keeps C-17 pending and shows an amber persistent **C-17 PENDING / OPEN ALERT** tab.
- The tab remains while the player returns to Maintenance room or inspects Workbench/Junction and reopens the same alert.
- The alert only clears when **HANDLE ALERT** is selected; from outside the Workstation there is a labeled transition to the Maintenance incident console.
- Quick Pin remains optional and saves the interrupted Coupler report's context. There is no arbitrary expiration.

### Reduced text density / navigation
- Shortened the existing static mission briefing (no new opening dialogue).
- Changed Objectives to shorter titles and moved optional Hints to the same centered dialog pattern.
- Shortened the Hub's status copy and action labels.
- Kept a compact, persistent current objective so first-time players know their intended task without a large paragraph overlay.
- The visual art stays visible unless the player actively opens evidence, a hint, or an alert.

## Player-facing interaction rules

1. **View the scene** — no permanent evidence description over art.
2. **Choose an object** — a hotspot opens one relevant observation.
3. **Close** — return to exactly where you were in the same scene.
4. **Interruption occurs** — a centered amber alert invites the player to save context, handle it or minimize it.
5. **If minimized** — C-17 stays pending as a visible tab until the player handles it.
6. **After C-17** — resume the Coupler work order, trace its serial, inspect Storage, and save a provisional theory.
7. **Opening dialogue** — intentionally deferred.

## Automated QA

- `npm run build` successful.
- Scene-first browser script at 1464x815 completed inspection overlays, Close/Escape behavior, a minimized persistent C-17 across room changes, handling from Workbench, crate/Coupler/serial overlays, Hub, Case Review and Reflection. 9 checks passed, 0 page errors.
- Unpinned test traversed optional Power Log, Storage, Case Review and Reflection. 0 page errors.
- Layout tested at 1024x576, 1280x720, 1464x815 and 1920x1080: centered modals and alert card remain in viewport; principal buttons remain visible. Narrow layouts may still use scrolling inside existing physical system monitors.
- Human first-time playtesting is still needed to check comprehension, visual comfort and timing.

## Still deferred

A very short character/comms opening and post-event context can be drafted later. It should not be implemented until the player confirms the current interaction pattern is comfortable.

## Post-playtest Quick Pin leak + inspection navigation correction — 2026-10-28

The player found that a saved Quick Pin details panel remained expanded when navigating from the Incident Hub into Storage. Because the HUD component persisted across scene changes, the left-floating RESUME REPORT panel covered the crate and even centered evidence dialogs. The previous canResumePin condition also incorrectly included Storage.

**Fix**
- Removed the redundant OPEN WORKSTATION // RECORD shortcut from Workbench/Junction focused inspection. BACK // MAINTENANCE is the only inspection-level navigation; the main room still has its Workstation hotspot.
- Removed the explanatory Observation only footer from inspection evidence dialogs.
- Quick Pin's report details + RESUME REPORT are now available only while the player is in the Incident Hub after completing the alert.
- In Storage, Workbench/Junction, Power and Case Review, Quick Pin remains a noninteractive status showing Saved context / 01 (or Empty / 00) without an expandable panel.
- Switching away from the Hub changes its details element into a static display, so even if the player expanded it just before traveling, the popup is unmounted automatically. Returning to the Hub starts collapsed.
- The actual saved cue, resumption action and reflection measurement remain intact. No evidence flags, destinations, scripts or case scope were added.

**Validation**
- New end-to-end browser reproduction of the exact bug: expand Quick Pin at Hub, travel to Storage B-04, open crate/Coupler/serial detail modal; zero visible Quick Pin panels or Resume buttons over Storage at 1024x576, 1280x720, 1464x815 and 1920x1080, 0 page errors, completing the loop to Reflection.
- Dedicated Quick Pin test: expand at Hub, click RESUME REPORT, Workstation opens and the popup closes, 0 page errors.
- Non-Pin regression: optional Power, Storage serial, theory and Reflection remain playable, 0 page errors.
- npm run build and git diff --check pass.
