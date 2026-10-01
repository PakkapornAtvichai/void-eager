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
