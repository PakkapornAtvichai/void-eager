# Project Status

## Status: SCOPE LOCKED FOR 3-DAY PROTOTYPE

The full Void-eager mystery remains the narrative reservoir, but the class prototype will demonstrate one complete gameplay loop rather than the entire ship investigation.

## Product goal

Demonstrate a research-informed serious-game mechanic for autistic players who experience difficulty with interruption, task switching, stopping/changing activities, or recovering context after a switch.

This is an experience-profile target, not a diagnostic severity band or autism support-level target.

## What success means

A player can complete the loop without explanation:
1. investigate a meaningful task;
2. encounter an interruption;
3. choose whether to preserve context with Quick Pin;
4. complete a short secondary task;
5. resume the original investigation;
6. recover what they were doing;
7. combine evidence;
8. make a small deduction;
9. reflect on what helped them resume.

## Kill rule

No new feature may delay completion of this loop.

## Implementation checkpoint — 2026-10-02

Completed:
- T01 app skeleton
- T02 explicit game state/reducer
- T03 Maintenance work-order investigation
- T04 interruption + Quick Pin/non-pin switch

Validation:
- `npm install`: 0 reported vulnerabilities
- `npm run build`: passes
- Vite dev server: responds locally

Next ticket: T05 — bounded secondary task.

## Implementation checkpoint — T05–T06

Completed:
- T05 bounded coolant-alert classification task
- T06 return/resume flow
- pinned return shows thread + last evidence + location
- unpinned return preserves access to the investigation but provides no Quick Pin reconstruction cue

Validation:
- `npm run build`: passes

Next ticket: T07 — Storage cross-check.

## Implementation checkpoint — T07–T09

Completed:
- T07 Storage cross-check
- T08 evidence-supported deduction with retry on unsupported/wrong conclusions
- T09 neutral reflection screen
- restart path for pinned vs unpinned comparison
- frontend testing hooks and brief

The complete vertical slice now runs:
Maintenance -> interruption -> secondary task -> resume -> Storage -> deduction -> reflection.

Next phase: frontend testing. Do not add features before test findings are recorded.

## Implementation checkpoint — T07–T09 / frontend-test handoff

Completed:
- T07 Storage physical-part + serial cross-check
- T08 evidence-supported deduction with recoverable wrong-answer path
- T09 neutral reflection summary and restart
- stable frontend test hooks across the full loop

Validation:
- `npm run build`: passes
- dev server: HTTP 200
- `git diff --check`: passes

Current status: implementation complete through reflection. Next step is frontend/UX testing; do not add features before the first test pass.

## Redesign checkpoint — Asynchronous Loop v2

The linear frontend-tested prototype remains tagged as `linear-frontend-baseline`.

v2 now implements:
- system-timed interruption during report reading;
- 8-second preparation window;
- Quick Pin without immediate task switch;
- persistent minimized Pin;
- saved Maintenance report scroll position;
- resumption through Pin restores the saved reading position;
- post-interruption Incident Board with Coupler + Power Spike threads;
- operational interruption response without correctness feedback;
- case theory saving without immediate right/wrong judgment;
- reflection that records process and theory neutrally.

Validation:
- `npm run build`: passes
- `git diff --check`: passes

Next step: frontend test using `docs/18-FRONTEND-TEST-BRIEF-V2.md`.

## UX continuity pass

The Yoko-integrated build is moving from prototype-page navigation to a stable in-game HUD and explicit investigation continuity.

Locked changes:
- Thread, Leads, Quick Pin, and Evidence are separate HUD concepts.
- Quick Pin details are collapsed until intentionally opened.
- `Trace serial` unlocks a Storage Lead; it no longer teleports immediately.
- Newly unlocked controls use a brief pulse, then settle.
- Navigation controls use a neutral/steel treatment separate from cyan investigation actions.
- Voluntary scene changes use a short location transition.
- Interruption remains the only system-driven context takeover.

See `docs/20-UX-CONTINUITY-AND-LEADS.md`.

## Visual UX audit pass 2

Automated 21-state desktop capture completed successfully and GPT-6 Luna visual audit returned **ONE MORE UX PASS**.

Resolved enough for demo:
- coolant / Incident Board / Power Spike now use ship-system framing;
- Storage has a recognizable CSS placeholder environment and visible coupler/crate;
- HUD semantics are scene-aware;
- Storage Lead has current/complete states;
- Reflection no longer exposes stale actionable Pin/Lead controls;
- no generated raster placeholder is required before demo; wait for Yoko.

Remaining freeze blockers are intentionally small:
1. increase navigation prominence;
2. explicitly label an unfollowed Storage Lead as AVAILABLE;
3. reduce the remaining centered-card feel in Coolant / Incident Board / Power Spike.

After those three items: rerun deterministic capture, then freeze Loop 1.

## Loop 1 frozen for demo

Final deterministic 21-state desktop capture completed successfully after the freeze pass.

GPT-6 Luna final visual gate:
- **VERDICT: FREEZE LOOP 1**
- blockers: none
- Storage CSS/HTML physical placeholder is sufficient for demo
- generated Storage art should wait for Yoko
- Coolant / Incident Board / Power are sufficient as placeholder ship-system screens
- navigation controls are visible
- Storage Lead AVAILABLE / CURRENT / COMPLETE state language is readable
- Reflection no longer exposes stale actionable Lead/Quick Pin controls
- automated implementation -> 21-state capture -> visual audit pipeline is viable

Further changes to Loop 1 should now be limited to critical bugs, accessibility fixes, or direct Yoko asset replacement. Do not add gameplay scope before the class demo.

## Yoko Packs A/B/C accepted and integrated

Yoko delivered three new source assets under `assets/incoming-yoko`:
- `Industrial Sci-Fi Incident Hub.png`
- `Pixel Sci-Fi HUD Asset Sheet.png`
- `Mechanical Crate and Coupler Asset Sheet.png`

Acceptance result: **PASS — no further Yoko revision required before implementation.**

Runtime processing:
- Pack A was normalized from 1672×941 to the native 1920×1080 game canvas without meaningful aspect distortion.
- Pack B was sliced into reusable transparent frame/button/panel assets while all live text remains HTML.
- Pack C was sliced into four graphical investigation states: closed crate, open crate, Coupler inspection, and serial detail.

Implemented behavior:
- Incident Board now lives inside a physical Main Hub / Incident Station background rather than floating on an abstract backdrop.
- Hub visibly anchors Maintenance access and Engineering access; Coupler selection explicitly returns to the Maintenance Workstation.
- Pack B cyan/amber/neutral UI art now skins live system panels, interruption, investigation actions, and navigation controls.
- Storage now requires physical graphical inspection: open crate → inspect Coupler → locate serial plate.
- Storage no longer reveals the serial before physical inspection and no longer states the deduction `Serials match`; it presents the two observed values for the player to interpret.

Validation:
- production build passes;
- `git diff --check` passes;
- automated 1920×1080 runtime capture passed Hub, Storage interaction states, interruption, coolant, Power, Theory, and Reflection.

## First-time-player continuity pass

User blind-play feedback exposed a navigation/meaning problem rather than a simple wording issue. The following were corrected:
- removed forced interruption countdown;
- coolant task now occupies the physical Maintenance workstation monitor at the 1920x1080 game stage;
- Incident Hub is now a persistent investigation home;
- Maintenance room has an explicit post-interruption exit back to Incident Hub;
- Storage returns to Hub and no longer launches Theory directly;
- Power is explicitly framed as an optional context/timeline thread;
- Case Review is launched deliberately from Hub after Storage serial verification;
- saving a theory returns to Hub;
- Reflection requires an explicit `End Investigation Session` action from Hub;
- Pack C open-crate crop artifact removed;
- Hub/Storage art is preloaded to avoid first-arrival blank-background flashes.

Automated first-time path validated 11 states from interruption through deliberate Reflection, including the previously soft-locking `Workstation -> NAV ROOM -> Maintenance -> Incident Hub` route.

Remaining important visual gap: final Storage environment/background.


## Loop 1 continuity/clarity pass — 2026-10-28

Scope remains the existing Coupler vertical slice. No new rooms, suspects, puzzles, or evidence were added.

Changes:
- Maintenance opens with an optional in-world incident briefing explaining the Coupler question and player role.
- The Workstation remains the only active Maintenance hotspot in this prototype; the briefing says so explicitly.
- The Workstation always offers a room exit. The scripted interruption is timed only while its report is in focus, not while standing elsewhere in Maintenance.
- Coolant alert copy states why shipwide triage was assigned to the Incident Systems Officer.
- Coolant response completes at the physical Workstation; traveling to the Hub now acknowledges a deliberate player navigation.
- Player-directed switches between Hub, Maintenance, Engineering Power, and Storage use the same short location transition.
- The Hub now labels the Coupler as the main case and Power as optional context; text in Hub and Coolant was made more readable.
- Saving a working theory still leaves the player in Case Review until they deliberately return to the Hub.

Validation:
- npm run build: passes (local Node 22.11.0 produces a Vite engine-version warning).
- Automated browser path through briefing, focus/back, interruption, coolant, Hub, Power, Storage, theory, and reflection: 12/12 steps passed with 0 page errors.
- This is a scripted browser validation, not a replacement for human first-time-player testing.


## Maintenance hotspot usability fix — 2026-10-28

Player feedback: the Maintenance artwork suggested several usable objects, but only Glint's Workstation responded. Workbench and Junction were explicitly disabled in code, despite having prepared close-up artwork.

Resolution within the existing Coupler vertical slice:
- All three room hotspots (Workbench, Workstation, Junction) now accept clicks and have persistent labels.
- Workbench and Junction open their existing Yoko focused views with two optional inspectable visual details each, a clear back-to-room action, and a direct return to the Workstation.
- Workbench observations concern the handwritten service checklist and a spare-part sketch; Junction observations concern a local display and enclosed service panel.
- These are contextual observations only; they do not create Evidence or Knowledge Flags, reveal the verdict, or add another puzzle, location, or mystery thread.
- The Workstation remains the formal Coupler work-order entry point and the only trigger for the existing timed interruption.
- The core investigation/interruption/recovery/Storage/theory/reflection path is unchanged.

Validation:
- Browser test at 1920x1080: all 3 hotspots enabled, both Workbench details, both Junction details, reversible navigation, intact interruption-to-reflection flow, 0 page errors.
- Browser test at 1479x821 (matching player screenshot scale): Workbench and Junction usable and observations readable, 0 page errors.


## UI readability and overflow correction — 2026-10-28

A player screenshot exposed tiny buttons and overlapping text in Storage/Quick Pin. Screen-by-screen fixes now cover Maintenance, Workstation, Coolant, Incident Hub, Power Log, Storage, Case Review, Reflection and the persistent bottom HUD. Storage's serial comparison is presented as two short readable rows, and Quick Pin no longer covers it. The original Yoko frames remain; Power and Case Review use dark reading mattes inside them so decorative rails do not cut through text.

Build and multi-resolution browser QA are documented in `docs/21-LOOP1-UI-READABILITY.md`. Scope remains the single Coupler Loop; no state-machine, clue, mystery, character or scene expansion was required. Tiny desktop viewports below 1280x720 may still use internal panel scrollbars.


## Loop 1 contextual objective guidance — 2026-10-28

Direct player feedback: the game worked but a first-time player did not know what to look for or what to do after the interruption. Implemented a persistent NEXT OBJECTIVE with optional NEED A HINT?; both reflect existing game and Storage inspection phases. The Incident Hub now indicates how to resume, where the green Replacement Serial lead is, when to record a theory and how to end the session. All paths remain player-chosen and Quick Pin remains optional. The engine state machine, evidence counts and mystery outcome are unchanged. Details: `docs/22-LOOP1-WAYFINDING.md`.


## Loop 1 scene-first interface and persistent alert — 2026-10-28

The Workbench/Junction and Storage evidence panels no longer permanently cover Yoko artwork. Inspection now uses centered click-to-open modals with explicit Close/Escape. C-17 can be minimized to a pending tab that persists when leaving the Workstation; it clears only on Handle Alert. Optional hints also use a dialog instead of expanding the top banner. Static UI copy and Hub button labels were shortened, without changing the single Coupler case or adding the deferred opening conversation. See `docs/23-LOOP1-SCENE-FIRST-INTERACTION.md` for test results and details.

## Quick Pin overlay regression corrected — 2026-10-28

Player screenshot reproduced a persistent RESUME REPORT popup from Hub over Storage's centered serial evidence dialog. The root cause was an uncontrolled details node surviving scene transitions and an overly broad canResumePin. Quick Pin details are now available only at the Incident Hub; other scenes display only its saved/empty status. Removing the redundant Workbench/Junction Workstation shortcut and the Observation only inspection footer further reduces clutter. Exact 4-viewport reproduction, Pin resume and non-Pin full playthrough passed with 0 JS page errors. Details in docs/23-LOOP1-SCENE-FIRST-INTERACTION.md.


## Loop 1 final gameplay design lock — 29 October 2026

**Documentation/design-only update; no gameplay source was changed.** The latest player review identified passive Work Order reading, a C-17 event keyed to a bare 12-second timer, a hard-coded/spoiling Quick Pin, a coolant-gated Storage Lead, an automatic conclusion in physical evidence, and non-interactive Reflection.

The **next implementation contract** is:
- Thai summary: docs/24-LOOP1-FINAL-GAMEPLAY-DESIGN-TH.md
- Complete event/flag/branch/testing specification: docs/24-LOOP1-FINAL-GAMEPLAY-DESIGN.md

Design is scoped to the existing Coupler Loop 1, existing rooms and art, one C-17 interruption, one chosen-intention Quick Pin, manual Work Order/Storage evidence comparison, working theory and neutral interactive Reflection. Do **not** add opening NPC dialogue or expand to the archived six-room mystery.

Implementation order: P0-A Workstation/ungated Storage; P0-B C-17/Pin/recovery; P0-C manual comparison/theory; P0-D Reflection/regression/human usability. Existing game build is not yet expected to behave according to this new design. Keep CURRENT vs TARGET distinctions explicit.
