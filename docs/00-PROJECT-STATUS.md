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
