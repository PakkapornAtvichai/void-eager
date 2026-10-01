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
